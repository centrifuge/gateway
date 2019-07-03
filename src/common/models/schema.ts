export class Schema {
 constructor(
   readonly name: string,
   readonly attributes: Attribute[],
   readonly registries: Registry[],
   readonly _id?: string,
 ){}

  public static validate(schema: Schema) {
    //validate that registry address is a hex string
  }
}

export interface Attribute {
  key: string,
  label: string,
  type: number | string,
}

export interface Registry {
  label: string,
  address: string,
  proofs: Array<string>
}

