export class Schema {
 constructor(
   readonly name: string,
   readonly attributes: Attribute[],
   public registries: Registry[],
   readonly _id?: string,
 ){}

  public static validateRegistryAddress(schema: Schema) {
   schema.registries.forEach(registry => {
     let hex = registry.address.substr(0,2);
     if (hex != "0x" || registry.address.length != 42) {
       throw new Error(`Registry address ${registry.address } must be a valid hex string`);
     }
   })
  }
}

export interface Attribute {
  label: string,
  type: number | string,
  value?: string
}

export interface Registry {
  label: string,
  address: string,
  proofs: Array<string>
}

