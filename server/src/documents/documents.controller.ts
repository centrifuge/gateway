import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CentrifugeService } from "../centrifuge-client/centrifuge.service";
import {
  CoreapiCreateDocumentRequest,
  FunFundingListResponse, UserapiTransferDetailListResponse,
} from "../../../clients/centrifuge-node";
import { FlexDocResponse, FlexDocument } from "../../../src/common/models/document";

@Controller()
export class DocumentsController {
  constructor(
      private readonly databaseService: DatabaseService,
      private readonly centrifugeService: CentrifugeService,
  ) {
  }

  @Post()
  /**
   * Create a generic document and save in the centrifuge node and the local database
   * @async
   * @param request - the http request
   * @param {FlexDoc} document - the body of the request
   * @return {Promise<FlexDocResponse>} result
   */
  async create(@Req() request, @Body() document: CoreapiCreateDocumentRequest): Promise<FlexDocResponse> {
    // TODO: collaborators?
    document.scheme = CoreapiCreateDocumentRequest.SchemeEnum.Generic;
    const createResult = await this.centrifugeService.documents.createDocument(
        request.user.account,
        document,
    );

    await this.centrifugeService.pullForJobComplete(createResult.header.job_id, request.user.account);
    return await this.databaseService.documents.insert({
      ...createResult,
      ownerId: request.user._id,
    });
  }

  @Get()
  /**
   * Get the list of all documents
   * @async
   * @return {Promise<FlexDocument[]>} result
   */
  async getList(@Req() request): Promise<FlexDocResponse[]> {
    const documents = this.databaseService.documents.getCursor({
      ownerId: request.user._id,
    }).sort({updatedAt: -1}).exec();
    return documents;
  }

  @Get(':id')
  /**
   * Get a specific genericDoc by id
   * @async
   * @param params - the request parameters
   * @param request - the http request
   * @return {Promise<FlexDocResponse|null>} result
   */
  async getById(@Param() params, @Req() request): Promise<FlexDocResponse | null> {

    const document = await this.databaseService.documents.findOne({
      _id: params.id,
      ownerId: request.user._id,
    });

    // We the call because the document is not updated on transfer and the header info is out of sync
    if (document.fundingAgreement) {
      const tokenId = document.fundingAgreement.funding.nft_address;
      // Search for the registry address
      const nft = document.header.nfts.find(item => {
        return item.token_id === tokenId;
      });
      if (nft) {
        const ownerResponse = await this.centrifugeService.nft.ownerOfNft(request.user.account, nft.token_id, nft.registry, request.user.account);
        document.fundingAgreement.nftOwner = ownerResponse.owner;
        document.fundingAgreement.nftRegistry = nft.registry;
      } else {
        throw new HttpException('Nft from funding agreement not found on document', HttpStatus.CONFLICT);
      }
    }
    return document;
  }

  /**
   * Updates a flexdoc and saves in the centrifuge node and local database
   * @async
   * @param {Param} params - the query params
   * @param {Param} request - the http request
   * @param {FlexDocument} updateFlexDocRequest - the updated flexdoc
   * @return {Promise<FlexDocument>} result
   */
  @Put(':id')
  async updateById(
      @Param() params,
      @Req() request,
      @Body() updateDocumentRequest: FlexDocument,
  ) {

    // TODO: collaborators?
    const document: FlexDocResponse = await this.databaseService.documents.findOne(
        {_id: params.id, ownerId: request.user._id},
    );

    const updateResult: FlexDocResponse = await this.centrifugeService.documents.updateDocument(
        request.user.account,
        document.header.document_id,
        {
          ...updateDocumentRequest,
        },
    );

    await this.centrifugeService.pullForJobComplete(updateResult.header.job_id, request.user.account);

    if (updateResult.attributes) {
      if (updateResult.attributes.funding_agreement) {
        const fundingList: FunFundingListResponse = await this.centrifugeService.funding.getList(
            updateResult.header.document_id,
            request.user.account,
        );
        updateResult.fundingAgreement = (fundingList.data ? fundingList.data.shift() : undefined);
      }
      if (updateResult.attributes.transfer_details) {
        const transferList: UserapiTransferDetailListResponse = await this.centrifugeService.transfer.listTransferDetails(
            request.user.account,
            updateResult.header.document_id,
        );
        updateResult.transferDetails = (transferList ? transferList.data : undefined);
      }

      // We need to delete the attributes prop because nedb does not allow for . in field names
      delete updateResult.attributes;
    }

    return await this.databaseService.documents.updateById(params.id, {
      ...updateResult,
      ownerId: request.user._id,
    });
  }
}