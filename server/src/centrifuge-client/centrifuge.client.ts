import { tokens } from './centrifuge.constants';
import { env } from 'process';
import { DocumentServiceApi } from '../../../clients/centrifuge-node/generated-client';

// set up singleton centrifuge node client
const centrifugeClient = new DocumentServiceApi({
  basePath: env.CENTRIFUGE_URL || 'https://localhost:8082',
});

export const centrifugeClientFactory = {
  provide: tokens.centrifugeClientFactory,
  useFactory: () => {
    return centrifugeClient;
  },
};
