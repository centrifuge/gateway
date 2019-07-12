import { isValidAddress } from "ethereumjs-util";

export class Schema {
 constructor(
   readonly name: string,
   readonly attributes: Attribute[],
   public registries: Registry[],
   readonly _id?: string,
 ){
   Schema.validateRegistryAddress(this)
   Schema.validateReferenceIdField(this)
 }

  public static validateRegistryAddress(schema: Schema) {
   schema.registries.forEach(registry => {
     let valid = isValidAddress(registry.address)
     if (!valid) {
       throw new Error(`${registry.address } is not a valid registry address`);
     }
   })
  }

  public static validateReferenceIdField(schema: Schema) {
   if (schema.attributes.length > 0) {
     const refID = schema.attributes.filter(attr => attr.label === 'reference_id');
     if (refID.length === 0) {
       throw new Error(`Attributes do not contain a reference ID`);
     }
   }
  }
}

export interface Attribute {
  name: string,
  label: string,
  type: AttrTypes.STRING | AttrTypes.TIMESTAMP | AttrTypes.INTEGER | AttrTypes.BYTES | AttrTypes.DECIMAL
}

export interface Registry {
  label: string,
  address: string,
  proofs: Array<string>
}

export enum AttrTypes {
  INTEGER = 'integer',
  DECIMAL = 'decimal',
  BYTES = 'bytes',
  STRING = 'string',
  TIMESTAMP = 'timestamp',
}
