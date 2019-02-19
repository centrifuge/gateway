import {
  AccountServiceApi,
  DocumentServiceApi,
} from '../../../clients/centrifuge-node/generated-client';

export interface CentrifugeClient {
  accounts: AccountServiceApi;
  documents: DocumentServiceApi;
}
