import { BehaviorSubject, Subject } from 'rxjs';

import { IClient } from '@splitsoftware/splitio/types/splitio';

export class BaseSplitService {
  private sdkReady = new BehaviorSubject(false);
  public sdkReady$ = this.sdkReady.asObservable();

  private sdkUpdate = new Subject();
  public sdkUpdate$ = this.sdkReady.asObservable();

  constructor(public client: IClient) {
    this.client.on(this.client.Event.SDK_READY, () => {
      this.sdkReady.next(true);
      this.sdkUpdate.next();
    });
    this.client.on(this.client.Event.SDK_UPDATE, () => this.sdkUpdate.next());
  }
}
