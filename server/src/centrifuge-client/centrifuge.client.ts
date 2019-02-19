import { tokens } from './centrifuge.constants';
import {
  AccountServiceApi,
  DocumentServiceApi,
} from '../../../clients/centrifuge-node/generated-client';
import config from '../config';
import { CentrifugeClient } from './centrifuge.interfaces';

const documentsClient = new DocumentServiceApi({}, config.centrifugeUrl);

const accountsClient = new AccountServiceApi({}, config.centrifugeUrl);

export const centrifugeClientFactory = {
  provide: tokens.centrifugeClientFactory,
  useFactory: (): CentrifugeClient => {
    return {
      documents: documentsClient,
      accounts: accountsClient,
    };
  },
};
