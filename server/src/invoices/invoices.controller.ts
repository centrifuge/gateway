import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Invoice } from '../../../src/common/models/invoice';
import { ROUTES } from '../../../src/common/constants';
import { SessionGuard } from '../auth/SessionGuard';
import {
  FunFundingListResponse,
  InvInvoiceResponse,
  UserapiTransferDetailListResponse,
} from '../../../clients/centrifuge-node';
import { DatabaseService } from '../database/database.service';
import { InvoiceResponse } from '../../../src/common/interfaces';
import { CentrifugeService } from '../centrifuge-client/centrifuge.service';

@Controller(ROUTES.INVOICES)
@UseGuards(SessionGuard)
export class InvoicesController {
  constructor(
    private readonly database: DatabaseService,
    private readonly centrifugeService: CentrifugeService,
  ) {
  }

  @Post()
  /**
   * Create an invoice and save in the centrifuge node and the local database
   * @async
   * @param request - the http request
   * @param {Invoice} invoice - the body of the request
   * @return {Promise<InvInvoiceResponse>} result
   */
  async create(@Req() request, @Body() invoice: Invoice): Promise<InvInvoiceResponse> {
    const collaborators = [invoice!.sender, invoice!.recipient].filter(item => item);

    const createResult = await this.centrifugeService.invoices.create(
      {
        data: {
          ...invoice,
        },
        write_access: collaborators,
      },
      request.user.account,
    );

    await this.centrifugeService.pullForJobComplete(createResult.header.job_id, request.user.account);

    return await this.database.invoices.insert({
      ...createResult,
      ownerId: request.user._id,
    });

  }

  @Get()
  /**
   * Get the list of all invoices
   * @async
   * @return {Promise<Invoice[]>} result
   */
  async get(@Req() request): Promise<InvoiceResponse[]> {
    const invoices = this.database.invoices.getCursor({
      ownerId: request.user._id,
    }).sort({ updatedAt: -1 }).exec();
    return invoices;
  }

  @Get(':id')
  /**
   * Get a specific invoice by id
   * @async
   * @param params - the request parameters
   * @param request - the http request
   * @return {Promise<Invoice|null>} result
   */
  async getById(@Param() params, @Req() request): Promise<InvoiceResponse | null> {

    const invoice = await this.database.invoices.findOne({
      _id: params.id,
      ownerId: request.user._id,
    });
    // TODO use header info when ready
    // We the call because the document is not updated on transfer and the header info is out of sync
    if (invoice.fundingAgreement) {
      const tokenId = invoice.fundingAgreement.funding.nft_address;
      // Search for the registry address
      const nft = invoice.header.nfts.find(item => {
        return item.token_id === tokenId;
      });
      if (nft) {
        const ownerResponse = await this.centrifugeService.nft.ownerOfNft(request.user.account, nft.token_id, nft.registry, request.user.account);
        invoice.fundingAgreement.nftOwner = ownerResponse.owner;
        invoice.fundingAgreement.nftRegistry = nft.registry;
      } else {
        throw new HttpException('Nft from funding agreement not found on invoice', HttpStatus.CONFLICT);
      }

    }
    return invoice;
  }

  /**
   * Updates an invoice and saves in the centrifuge node and local database
   * @async
   * @param {Param} params - the query params
   * @param {Param} request - the http request
   * @param {Invoice} updateInvoiceRequest - the updated invoice
   * @return {Promise<Invoice>} result
   */
  @Put(':id')
  async updateById(
    @Param() params,
    @Req() request,
    @Body() updateInvoiceRequest: Invoice,
  ) {

    const collaborators = [updateInvoiceRequest!.sender, updateInvoiceRequest!.recipient].filter(item => item);

    const invoice: InvInvoiceResponse = await this.database.invoices.findOne(
      { _id: params.id, ownerId: request.user._id },
    );

    const updateResult: InvoiceResponse = await this.centrifugeService.invoices.update(
      invoice.header.document_id,
      {
        data: { ...updateInvoiceRequest },
        write_access: collaborators,
      },
      request.user.account,
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

    return await this.database.invoices.updateById(params.id, {
      ...updateResult,
      ownerId: request.user._id,
    });
  }
}
