export class MintNftRequest {
  document_id:string
  proof_fields: string[];
  deposit_address: string;
  registry_address: string
}

export class TransferNftRequest {
  token_id:string;
  to: string;
  registry: string;
}
