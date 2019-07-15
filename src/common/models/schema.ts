import { isValidAddress } from 'ethereumjs-util';

export class Schema {
  constructor(
    readonly name: string,
    readonly attributes: Attribute[],
    public registries?: Registry[],
    readonly _id?: string,
  ) {
    Schema.validateRegistryAddress(this);
  }

  public static validateRegistryAddress(schema: Schema) {
    schema.registries && schema.registries.forEach(registry => {
      let valid = isValidAddress(registry.address);
      if (!valid) {
        throw new Error(`${registry.address} is not a valid registry address`);
      }
    });
  }
}

export interface Attribute {
  label: string,
  name: string,
  type: AttrTypes.STRING | AttrTypes.TIMESTAMP | AttrTypes.INTEGER | AttrTypes.BYTES | AttrTypes.DECIMAL,
}

export interface Registry {
  label: string,
  address: string,
  proofs: Array<string>
}

export enum AttrTypes {
  INTEGER = 'integer',
  DECIMAL = 'decimal',
  STRING = 'string',
  TIMESTAMP = 'timestamp',
  BYTES = 'bytes',
}
