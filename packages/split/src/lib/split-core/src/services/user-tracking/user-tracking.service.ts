import { Inject, Injectable } from '@angular/core';
import {
  IClient,
  Properties as SplitTrackingProperties,
  SplitKey,
} from '@splitsoftware/splitio/types/splitio';
import { SplitClient } from '../../providers';

@Injectable({
  providedIn: 'root',
})
export class UserTrackingService {
  constructor(@Inject(SplitClient) private splitClient: IClient) {}

  track(
    key: SplitKey,
    trafficType: string,
    eventType: string,
    value?: number,
    properties?: SplitTrackingProperties
  ): boolean {
    return this.splitClient.track(
      key,
      trafficType,
      eventType,
      value,
      properties
    );
  }
}
