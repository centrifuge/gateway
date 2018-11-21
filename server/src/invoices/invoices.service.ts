import { Inject, Injectable } from '@nestjs/common';
import { Invoice } from './interfaces/invoice';
import { DatabaseRepository } from '../database/database.repository';
import { tokens } from './invoices.constants';

@Injectable()
export class InvoicesService {
  constructor(
    @Inject(tokens.invoicesRepository)
    private readonly invoicesRepository: DatabaseRepository<Invoice>,
  ) {}

  async create(invoice: Invoice) {
    await this.invoicesRepository.create(invoice);
  }

  async get() {
    return await this.invoicesRepository.get();
  }
}
