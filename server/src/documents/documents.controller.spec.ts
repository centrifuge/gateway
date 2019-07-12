import { Test, TestingModule } from "@nestjs/testing";
import { FlexDocument } from "../../../src/common/models/document";
import { SessionGuard } from "../auth/SessionGuard";
import { databaseServiceProvider } from "../database/database.providers";
import { DatabaseService } from "../database/database.service";
import { DocumentsController } from "./documents.controller";
import { centrifugeServiceProvider } from "../centrifuge-client/centrifuge.module";
import { CoreapiCreateDocumentRequest } from "../../../clients/centrifuge-node";
import {InvoicesController} from "../invoices/invoices.controller";
import {Invoice} from "../../../src/common/models/invoice";

describe('DocumentsController', () => {
  let documentsModule: TestingModule;
  const documentToCreate: FlexDocument = {
    read_access: ['0x111'],
    write_access: ['0x222'],
    attributes: {
      'animal_type': 'iguana',
      'number_of_legs': 4,
      'diet': 'insects',
    },
    schema_id: 'iUSDF2ax31e',
  };

  const databaseSpies: any = {};

  beforeEach(async () => {
    documentsModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        SessionGuard,
        centrifugeServiceProvider,
        databaseServiceProvider,
      ],
    }).compile();

    const databaseService = documentsModule.get<DatabaseService>(DatabaseService);

    databaseSpies.spyInsert = jest.spyOn(databaseService.documents, 'insert');
    databaseSpies.spyUpdate = jest.spyOn(databaseService.documents, 'update');
    databaseSpies.spyGetAll = jest.spyOn(databaseService.documents , 'getCursor');
  });

  describe('create', () => {
    it('should return the created document', async () => {
      const documentsController = documentsModule.get<DocumentsController>(
          DocumentsController,
      );

      const payload: CoreapiCreateDocumentRequest = {
        ...documentToCreate,
      };
      const result = await documentsController.create(
          {user: {_id: 'user_id'}},
          payload
      );

      expect(result).toMatchObject({
          ...documentToCreate,
        header: {
          job_id: 'some_job_id',
        },
        ownerId: 'user_id',
      });

      expect(databaseSpies.spyInsert).toHaveBeenCalledTimes(1);
    });
  })

  describe('get documents list', () => {

    it('should get the list of documents from the database', async () => {
      const documentsController = documentsModule.get<DocumentsController>(
          DocumentsController,
      );

      const payload: CoreapiCreateDocumentRequest = {
        ...documentToCreate,
      };

      await documentsController.create(
          {user: {_id: 'user_id'}},
          payload
      );

      payload.attributes = {
        'animal_type': 'snake',
        'number_of_legs': 0,
        'diet': 'insects',
      };

      await documentsController.create(
          {user: {_id: 'user_id'}},
          payload,
      );


      const result = await documentsController.getList({
        user: { _id: 'user_id' },
      });

      expect(result.length).toEqual(2);
      expect(databaseSpies.spyGetAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', function() {
    it('should update the specified document', async function() {
      const documentsController = documentsModule.get<DocumentsController>(
          DocumentsController,
      );

      const updatedDocument: FlexDocument = {
        ...documentToCreate,
      };

      const updateResult = await documentsController.updateById(
          { id: insertedInvoice._id },
          { user: { _id: 'user_id', account: '0x4441122' } },
          { ...updatedInvoice },
      );

      expect(databaseSpies.spyFindOne).toHaveBeenCalledWith({
        _id: insertedInvoice._id,
        ownerId: 'user_id',
      });
      expect(invoiceSpies.spyUpdate).toHaveBeenCalledWith(
          '0x39393939',
          {
            data: { ...updatedInvoice },
            write_access: [updatedInvoice.sender, updatedInvoice.recipient],
          },
          '0x4441122',
      );

      expect(updateResult).toMatchObject({
        data: {
          ...updatedInvoice,
        },
        write_access: [updatedInvoice.sender, updatedInvoice.recipient],
      });
    });
  });

  describe('get by id', function() {
    it('should return the invoice by id', async function() {
      const invoiceController = invoicesModule.get<InvoicesController>(
          InvoicesController,
      );

      const result = await invoiceController.getById(
          { id: insertedInvoice._id },
          { user: { _id: 'user_id' } },
      );
      expect(databaseSpies.spyFindOne).toHaveBeenCalledWith({
        _id: insertedInvoice._id,
        ownerId: 'user_id',
      });

      expect(result).toMatchObject({
        data: invoice,
        header: {
          document_id: '0x39393939',
        },
      });
    });
  });
})