import {Body, Controller, Get, Post, Req} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { CentrifugeService } from "../centrifuge-client/centrifuge.service";
import {
  CoreapiCreateDocumentRequest,
  CoreapiDocumentResponse,
} from "../../../clients/centrifuge-node";
import {GenericDocument} from "../../../src/common/models/document";
import {InvoiceResponse} from "../../../src/common/interfaces";

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
   * @param {GenericDocument} document - the body of the request
   * @return {Promise<CoreapiDocumentResponse>} result
   */
  async create(@Req() request, @Body() document: CoreapiCreateDocumentRequest): Promise<CoreapiDocumentResponse> {
    // collaborators
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
   * @return {Promise<GenericDocument[]>} result
   */
  async getList(@Req() request): Promise<InvoiceResponse[]> {
    const documents = this.databaseService.documents.getCursor({
      ownerId: request.user._id,
    }).sort({ updatedAt: -1 }).exec();
    return documents;
  }

  // GetById

  // Update

}