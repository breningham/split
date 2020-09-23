import { Inject, Injectable } from '@angular/core';
import {
  IClient,
  Properties as SplitTrackingProperties,
  SplitKey,
} from '@splitsoftware/splitio/types/splitio';
import { Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';
import { SplitClient } from '../../providers';
import { throwIfSDKNotReady } from '../../utils/throwIfSDKNotReady';
import { BaseSplitService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class UserTrackingService extends BaseSplitService {
  constructor(@Inject(SplitClient) client: IClient) {
    super(client);
  }

  track(
    key: SplitKey,
    trafficType: string,
    eventType: string,
    value?: number,
    properties?: SplitTrackingProperties
  ): Observable<boolean> {
    return this.sdkReady$.pipe(
      throwIfSDKNotReady,
      map(() =>
        this.client.track(key, trafficType, eventType, value, properties)
      ),
      retryWhen((errors) => errors.pipe(delay(100), take(3)))
    );
  }
}
