import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionGuard } from '../auth/SessionGuard';
import { ROUTES } from '../../../src/common/constants';
import { DatabaseService } from '../database/database.service';
import {Schema} from "../../../src/common/models/schema";

@Controller(ROUTES.SCHEMAS)
@UseGuards(SessionGuard)
export class SchemasController {
  constructor(
      private readonly databaseService: DatabaseService,
  ) {}

  @Post()
  /**
   * Creates a new schema in the DB
   * @async
   * @param {Request} request - the http request
   * @param {Schema} schema - the body of the request
   * @return {Promise<Schema>} result
   */
  async create(@Req() request, @Body() schema: Schema) {
    try {
      Schema.validate(schema);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }

    const newSchema = new Schema(
        schema.name,
        schema.attributes,
        schema.registries,
        request.user._id,
    );
    return await this.databaseService.schemas.insert(newSchema);
  }

  @Get()
  /**
   * Get the list of all schemas for the authenticated user
   * @async
   * @param {Request} request - The http request
   * @return {Promise<Schema[]>} result
   */
  async get(@Req() request) {
    return this.databaseService.schemas.find({})
  }

  @Put(':id')
  /**
   * Update a schema by id, provided as a query parameter
   * @async
   * @param {any} params - the request parameters
   * @param {Schema} updateSchemaObject - the update object for the schema
   * @param {Request} request - the http request
   * @return {Promise<Schema>} result
   */
  async updateById(
      @Param() params,
      @Body() updateSchemaObject: Schema,
      @Req() request,
  ) {
    // validate that the update does not update name or attributes of the schema
    return this.databaseService.schemas.update(
        { _id: params.id },
        { ...updateSchemaObject },
    );
  }
}
