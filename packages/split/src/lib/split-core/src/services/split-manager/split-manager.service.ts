import { Inject, Injectable } from '@angular/core';
import {
  IManager,
  SplitView,
  SplitViews,
} from '@splitsoftware/splitio/types/splitio';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map, retryWhen, take } from 'rxjs/operators';

import { SplitManager } from '../../providers';
import { throwIfSDKNotReady } from '../../utils/throwIfSDKNotReady';

@Injectable({
  providedIn: 'root',
})
export class SplitManagerService {
  sdkReady = new BehaviorSubject(false);
  sdkReady$ = this.sdkReady.asObservable();

  constructor(@Inject(SplitManager) private manager: IManager) {
    this.manager.on(this.manager.Event.SDK_READY, () =>
      this.sdkReady.next(true)
    );
  }

  getSplitInfo(splitName: string): Observable<SplitView> {
    return this.sdkReady$.pipe(
      throwIfSDKNotReady,
      map(() => this.manager.split(splitName)),
      retryWhen((errors) => errors.pipe(delay(100), take(3)))
    );
  }

  listSplits(): Observable<SplitViews> {
    return this.sdkReady$.pipe(
      throwIfSDKNotReady,
      map(() => this.manager.splits()),
      retryWhen((errors) => errors.pipe(delay(100), take(3)))
    );
  }
}
