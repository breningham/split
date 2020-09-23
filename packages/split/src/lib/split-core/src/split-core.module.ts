import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  SplitClient,
  SplitConfiguration,
  SplitManager,
  SplitSDK,
  splitClientFactory,
  splitManagerFactory,
  splitSDKFactory
} from './providers';

import { IBrowserSettings } from '@splitsoftware/splitio/types/splitio';

@NgModule({})
export class SplitCoreModule {
  static forRoot(
    splitConfiguration: IBrowserSettings
  ): ModuleWithProviders<SplitCoreModule> {
    return {
      ngModule: SplitCoreModule,
      providers: [
        { provide: SplitConfiguration, useValue: splitConfiguration },
        {
          provide: SplitSDK,
          useFactory: splitSDKFactory,
          deps: [SplitConfiguration],
        },
        {
          provide: SplitClient,
          useFactory: splitClientFactory,
          deps: [SplitSDK],
        },
        {
          provide: SplitManager,
          useFactory: splitManagerFactory,
          deps: [SplitSDK]
        }
      ],
    };
  }
}
