import { CoreapiCreateDocumentRequest } from "../../../clients/centrifuge-node";

export interface GenericDocument extends CoreapiCreateDocumentRequest {
  _id?: string;
  ownerId?: string;
  schema_id?: string;
}