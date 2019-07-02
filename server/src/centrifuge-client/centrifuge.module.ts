import { Module } from '@nestjs/common';
import { CentrifugeService } from './centrifuge.service';
import { MockCentrifugeService } from "./centrifuge-client.mock";

function checkNodeEnvironment(){
  switch(process.env.NODE_ENV) {
    case 'test': {
      const mockCentrifugeService = new MockCentrifugeService()
      return mockCentrifugeService
    }
    case 'functional': {
      // return srv of local Centrifuge node
    }
    return CentrifugeService
  }
}

export const centrifugeServiceProvider = {
  provide: CentrifugeService,
  useValue: checkNodeEnvironment()
};

@Module({
  providers: [centrifugeServiceProvider],
  exports: [centrifugeServiceProvider],
})
export class CentrifugeModule {}
