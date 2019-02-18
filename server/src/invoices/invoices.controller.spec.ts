import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { Invoice } from '../../../src/common/models/invoice';
import { SessionGuard } from '../auth/SessionGuard';
import { centrifugeClientFactory } from '../centrifuge-client/centrifuge.client';
import { tokens as clientTokens } from '../centrifuge-client/centrifuge.constants';
import { tokens as databaseTokens } from '../database/database.constants';
import { databaseConnectionFactory } from '../database/database.providers';
import { Contact } from '../../../src/common/models/contact';
import { InvoiceInvoiceData } from '../../../clients/centrifuge-node/generated-client';

describe('InvoicesController', () => {
  let invoicesModule: TestingModule;

  const invoice: Invoice = {
    invoice_number: '999',
    sender_name: 'cinderella',
    recipient_name: 'step mother',
  };
  let fetchedInvoices: Invoice[];

  const supplier = new Contact(
    'fast',
    '0xc111111111a4e539741ca11b590b9447b26a8057',
    'fairy_id',
  );

  class DatabaseServiceMock {
    invoices = {
      create: jest.fn(val => val),
      find: jest.fn(() =>
        fetchedInvoices.map(
          (data: Invoice): InvoiceInvoiceData => ({
            ...data,
          }),
        ),
      ),
      findOne: jest.fn(() => ({
        data: invoice,
        header: {
          document_id: 'find_one_invoice_id',
        },
      })),
      updateById: jest.fn((id, value) => value),
    };
    contacts = {
      findOne: jest.fn(() => supplier),
    };
  }

  const databaseServiceMock = new DatabaseServiceMock();

  class CentrifugeClientMock {
    create = jest.fn(data => data);
    update = jest.fn((id, data) => data);
  }

  const centrifugeClientMock = new CentrifugeClientMock();

  beforeEach(async () => {
    fetchedInvoices = [
      {
        invoice_number: '100',
        recipient_name: 'pumpkin',
        sender_name: 'godmother',
        _id: 'fairy_id',
      },
    ];

    invoicesModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        SessionGuard,
        centrifugeClientFactory,
        databaseConnectionFactory,
      ],
    })
      .overrideProvider(databaseTokens.databaseConnectionFactory)
      .useValue(databaseServiceMock)
      .overrideProvider(clientTokens.centrifugeClientFactory)
      .useValue(centrifugeClientMock)
      .compile();

    databaseServiceMock.invoices.create.mockClear();
    databaseServiceMock.invoices.find.mockClear();
    databaseServiceMock.contacts.findOne.mockClear();
  });

  describe('create', () => {
    it('should return the created invoice', async () => {
      const invoicesController = invoicesModule.get<InvoicesController>(
        InvoicesController,
      );

      const result = await invoicesController.create(
        { user: { _id: 'user_id' } },
        invoice,
      );
      expect(result).toEqual({
        data: {
          ...invoice,
        },
        collaborators: undefined,
        ownerId: 'user_id',
      });

      expect(databaseServiceMock.invoices.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('get', () => {
    describe('when supplier has been set', async () => {
      it('should add the supplier to the response', async () => {
        const invoicesController = invoicesModule.get<InvoicesController>(
          InvoicesController,
        );

        const result = await invoicesController.get({
          user: { _id: 'user_id' },
        });
        expect(result[0].supplier).toBe(supplier);
        expect(databaseServiceMock.invoices.find).toHaveBeenCalledTimes(1);
      });
    });

    describe('when supplier id is invalid', async () => {
      beforeEach(() => {
        databaseServiceMock.contacts.findOne = jest.fn(() => undefined);
      });

      it('should not add the supplier to the response', async () => {
        const invoicesController = invoicesModule.get<InvoicesController>(
          InvoicesController,
        );

        const result = await invoicesController.get({
          user: { _id: 'user_id' },
        });
        expect(result[0].supplier).toBe(undefined);
        expect(databaseServiceMock.invoices.find).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('update', function() {
    it('should update the specified invoice', async function() {
      const invoiceController = invoicesModule.get<InvoicesController>(
        InvoicesController,
      );

      const updatedInvoice: Invoice = {
        ...invoice,
        invoice_number: 'updated_number',
        collaborators: ['new_collaborator'],
      };

      const updateResult = await invoiceController.updateById(
        { id: 'id_to_update' },
        { user: { _id: 'user_id' } },
        { ...updatedInvoice },
      );

      expect(databaseServiceMock.invoices.findOne).toHaveBeenCalledWith({
        _id: 'id_to_update',
        ownerId: 'user_id',
      });
      expect(centrifugeClientMock.update).toHaveBeenCalledWith(
        'find_one_invoice_id',
        {
          data: { ...updatedInvoice },
          collaborators: ['new_collaborator'],
        },
      );

      expect(databaseServiceMock.invoices.updateById).toHaveBeenCalledWith(
        'id_to_update',
        {
          ...updateResult,
        },
      );
    });
  });

  describe('get by id', function() {
    it('should return the purchase order by id', async function() {
      const invoiceController = invoicesModule.get<InvoicesController>(
        InvoicesController,
      );

      const result = await invoiceController.getById(
        { id: 'some_id' },
        { user: { _id: 'user_id' } },
      );
      expect(databaseServiceMock.invoices.findOne).toHaveBeenCalledWith({
        _id: 'some_id',
        ownerId: 'user_id',
      });

      expect(result).toEqual({
        data: invoice,
        header: {
          document_id: 'find_one_invoice_id',
        },
      });
    });
  });
});
