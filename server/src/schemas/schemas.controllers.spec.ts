import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { Schema } from '../../../src/common/models/schema';
import { SessionGuard } from '../auth/SessionGuard';
import { databaseServiceProvider } from '../database/database.providers';
import { DatabaseService } from '../database/database.service';
import { SchemasController } from "./schemas.controllers";
const delay = require('util').promisify(setTimeout);

describe('SchemasController', () => {
  let schemaModule: TestingModule;
  const schemaToCreate = new Schema(
      'bestAnimals',
      [
        {
          label: 'wingspans',
          type: 'string',
        }
      ]
      ,
      [
        {
          label: 'BEST_ANIMALS_NFT',
          address: '0x3Ba4280217e78a0EaEA612c1502FC2e92A7FE5D7',
          proofs: [
            'attributes.wingspans',
            'header.document_id'
          ]
        }
      ],
  );

  const databaseSpies: any = {};

  beforeEach(async () => {
    schemaModule = await Test.createTestingModule({
      controllers: [SchemasController],
      providers: [
        SessionGuard,
        databaseServiceProvider,
      ],
    })
      .compile();

    const databaseService = schemaModule.get<DatabaseService>(DatabaseService);

    databaseSpies.spyInsert = jest.spyOn(databaseService.schemas, 'insert');
    databaseSpies.spyUpdate = jest.spyOn(databaseService.schemas, 'update');
    databaseSpies.spyGetAll = jest.spyOn(databaseService.schemas, 'find');
  });

  describe('create', () => {
    it('should return the created schema', async () => {
      const schemasController = schemaModule.get<SchemasController>(
          SchemasController,
      );

      const result = await schemasController.create(
          schemaToCreate,
      );

      expect(result).toMatchObject({
        name: schemaToCreate.name,
        attributes: schemaToCreate.attributes,
        registries: schemaToCreate.registries
      });

      expect(databaseSpies.spyInsert).toHaveBeenCalledTimes(1);
    });

    it('should throw error when registry address is of the wrong format', async function() {
      expect.assertions(3);
      const schemasController = schemaModule.get<SchemasController>(
          SchemasController,
      );

      try {
        await schemasController.create({
          registries: [
            {
              address: '0x111'
            }
          ]} as Schema);
      } catch (err) {
        expect(err.message).toEqual('Registry address 0x111 must be a valid hex string');
        expect(err.status).toEqual(400);
        expect(err instanceof HttpException).toEqual(true);
      }
    });
  });

  describe('get', () => {
    it('should return a list of schemas', async () => {
      const schemasController = schemaModule.get<SchemasController>(
          SchemasController,
      );

      for (let i = 0; i < 5; i ++) {
        await delay(0);
        schemaToCreate.registries[0].label = `increment_${i}` ;
        await schemasController.create(schemaToCreate);
      }

      const result = await schemasController.get();
      expect(result.length).toEqual(5);
      expect(databaseSpies.spyGetAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', function() {
    it('should update the schema in the database', async function() {
      const schemasController = schemaModule.get<SchemasController>(
          SchemasController,
      );

      const result = await schemasController.create(
          schemaToCreate,
      );

      const updateSchemaObject = {
        name: 'testupdate',
        registries: [
          {
            address: '0x5Ta4280217e78a0EaEA612c1502FC2e92A7FE6O9',
          }
        ]
      } as Schema;

      await schemasController.updateById(
          { id: result._id },
          updateSchemaObject,
      );

      expect(databaseSpies.spyUpdate).toHaveBeenCalledTimes(1);
      expect(databaseSpies.spyUpdate).toHaveBeenCalledWith(
          {
            _id: result._id,
          },
          { ...updateSchemaObject },
      );

      const updated = await schemasController.getById({id: result._id});
      expect(updated!.registries[0].address).toEqual(updateSchemaObject.registries[0].address)
    });
  });
});
