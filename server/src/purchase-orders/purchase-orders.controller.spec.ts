import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { SessionGuard } from '../auth/SessionGuard';
import { databaseServiceProvider } from '../database/database.providers';
import { PurchaseOrder } from '../../../src/common/models/purchase-order';
import config from '../../../src/common/config';
import { DatabaseService } from '../database/database.service';
import { CentrifugeService } from '../centrifuge-client/centrifuge.service';
import {MockCentrifugeService} from "../centrifuge-client/centrifuge-client.mock";

describe('PurchaseOrdersController', () => {
  let centrifugeId;

  beforeAll(() => {
    centrifugeId = config.admin.account;
    config.admin.account = 'centrifuge_id';
  });

  afterAll(() => {
    config.admin.account = centrifugeId;
  });

  let purchaseOrdersModule: TestingModule;

  const purchaseOrder: PurchaseOrder = {
    number: '999',
    requester_name: 'cinderella',
    ship_to_company_name: 'step mother',
    collaborators: ['new_collaborator'],
  };

  const fetchedPurchaseOrders: PurchaseOrder[] = [
    {
      requester_name: 'alberta',
      sender_order_id: '0xc111111111a4e539741ca11b590b9447b26a8057',
    },
  ];

  class DatabaseServiceMock {
    purchaseOrders = {
      insert: jest.fn(val => val),
      find: jest.fn(() => fetchedPurchaseOrders),
      findOne: jest.fn(() => ({
        data: purchaseOrder,
        header: {
          document_id: 'find_one_document_id',
        },
      })),
      updateById: jest.fn((id, value) => value),
    };
  }

  const databaseServiceMock = new DatabaseServiceMock();

  const mockCentrifugeService = new MockCentrifugeService()
  const centrifugeServiceProvider = {
    provide: CentrifugeService,
    useValue: mockCentrifugeService
  }

  beforeEach(async () => {
    purchaseOrdersModule = await Test.createTestingModule({
      controllers: [PurchaseOrdersController],
      providers: [
        SessionGuard,
        centrifugeServiceProvider,
        databaseServiceProvider,
      ],
    })
      .overrideProvider(DatabaseService)
      .useValue(databaseServiceMock)
      .compile();

    databaseServiceMock.purchaseOrders.insert.mockClear();
    databaseServiceMock.purchaseOrders.find.mockClear();
  });

  describe('create', () => {
    it('should return the created purchase order', async () => {
      const purchaseOrdersController = purchaseOrdersModule.get<PurchaseOrdersController>(PurchaseOrdersController);

      const result = await purchaseOrdersController.create(
        { user: { _id: 'user_id' } },
        purchaseOrder,
      );

      expect(result).toEqual({
        write_access: ['new_collaborator'],
        data: purchaseOrder,
        ownerId: 'user_id',
      });

      expect(databaseServiceMock.purchaseOrders.insert).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('get', () => {
    it('should return a list of contacts', async () => {
      const purchaseOrdersController = purchaseOrdersModule.get<PurchaseOrdersController>(PurchaseOrdersController);

      const result = await purchaseOrdersController.get({
        user: { _id: 'some_user_id' },
      });
      expect(result).toBe(fetchedPurchaseOrders);
      expect(databaseServiceMock.purchaseOrders.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', function() {
    it('should update the specified purchase order', async function() {
      const purchaseOrdersController = purchaseOrdersModule.get<PurchaseOrdersController>(PurchaseOrdersController);

      const updatedOrder = { ...purchaseOrder, number: 'updated_number' };

      const updateResult = await purchaseOrdersController.update(
        { id: 'id_to_update' },
        { user: { _id: 'user_id' } },
        { ...updatedOrder },
      );

      expect(databaseServiceMock.purchaseOrders.findOne).toHaveBeenCalledWith({
        _id: 'id_to_update',
        ownerId: 'user_id',
      });
      expect(mockCentrifugeService.purchaseOrders.update).toHaveBeenCalledWith(
        'find_one_document_id',
        {
          data: {
            ...updatedOrder,
          },
          write_access: ['new_collaborator'],
        },
        config.admin.account,
      );

      expect(
        databaseServiceMock.purchaseOrders.updateById,
      ).toHaveBeenCalledWith('id_to_update', {
        ...updateResult,
      });
    });
  });

  describe('get by id', function() {
    it('should return the purchase order by id', async function() {
      const purchaseOrdersController = purchaseOrdersModule.get<PurchaseOrdersController>(PurchaseOrdersController);

      const result = await purchaseOrdersController.getById(
        { id: 'some_id' },
        { user: { _id: 'user_id' } },
      );
      expect(databaseServiceMock.purchaseOrders.findOne).toHaveBeenCalledWith({
        _id: 'some_id',
        ownerId: 'user_id',
      });

      expect(result).toEqual({
        data: purchaseOrder,
        header: {
          document_id: 'find_one_document_id',
        },
      });
    });
  });
});
