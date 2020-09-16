import { IBrowserSettings } from '@splitsoftware/splitio/types/splitio';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { splitSDKFactory, SplitConfiguration, SplitSDK } from './providers';

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
      ],
    };
  }
}
