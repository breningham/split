import {
  IBrowserSettings,
  IClient,
  IManager,
  ISDK,
} from '@splitsoftware/splitio/types/splitio';

import { InjectionToken } from '@angular/core';
import { SplitFactory } from '@splitsoftware/splitio';

export const SplitConfiguration = new InjectionToken<IBrowserSettings>(
  'SplitConfiguration'
);
export const SplitSDK = new InjectionToken<ISDK>('SplitSDK');

export const splitSDKFactory = (configuration: IBrowserSettings) =>
  SplitFactory(configuration);

export const SplitClient = new InjectionToken<IClient>('SplitClient');

export const splitClientFactory = (sdk: ISDK) => sdk.client();

export const SplitManager = new InjectionToken<IManager>('SplitManager');
export const splitManagerFactory = (sdk: ISDK) => sdk.manager();
