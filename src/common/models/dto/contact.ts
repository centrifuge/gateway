import { isAddress } from 'ethereum-address';

export class Contact {
  constructor(
    readonly name: string,
    readonly address: string,
    readonly ownerId?: string,
    readonly _id?: string,
  ) {}

  public static validate(contact: Contact) {
    if (!contact.name) {
      throw new Error('Contact name not specified');
    }

    if (!contact.address) {
      throw new Error('Contact address not specified');
    }

    if (!isAddress(contact.address)) {
      throw new Error('The format of the Ethereum Address is incorrect');
    }
  }
}
