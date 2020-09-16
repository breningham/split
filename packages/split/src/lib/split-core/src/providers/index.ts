import { InjectionToken } from '@angular/core';
import { SplitFactory } from '@splitsoftware/splitio';
import {
  IBrowserSettings,
  IClient,
  ISDK,
} from '@splitsoftware/splitio/types/splitio';

export const SplitConfiguration = new InjectionToken<IBrowserSettings>(
  'SplitConfiguration'
);
export const SplitSDK = new InjectionToken<ISDK>('SplitSDK');

export const splitSDKFactory = ( configuration: IBrowserSettings ) => {
    return SplitFactory(configuration);
}

export const SplitClient = new InjectionToken<IClient>('SplitClient');

export const splitClientFactory = ( sdk: ISDK ) => {
  return sdk.client();
}