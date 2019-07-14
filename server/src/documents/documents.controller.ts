import {Body, Controller, Get, Param, Post, Put, Req, UseGuards} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CentrifugeService } from "../centrifuge-client/centrifuge.service";
import {
  CoreapiCreateDocumentRequest,
} from "../../../clients/centrifuge-node";
import { FlexDocResponse, FlexDocument } from "../../../src/common/models/document";
import { ROUTES } from "../../../src/common/constants";
import { SessionGuard } from "../auth/SessionGuard";

@Controller(ROUTES.DOCUMENTS)
@UseGuards(SessionGuard)
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
   * Get a specific FlexDoc by id
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

    return await this.databaseService.documents.updateById(params.id, {
      ...updateResult,
      ownerId: request.user._id,
    });
  }
}