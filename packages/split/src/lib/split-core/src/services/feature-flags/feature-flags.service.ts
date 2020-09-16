import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  Attributes,
  IClient,
  ISDK,
} from '@splitsoftware/splitio/types/splitio';
import { throwIfFalseWithMessage } from '../../utils/throw-if-false-with-message';
import { SplitSDK } from '../../providers';
import {
  BehaviorSubject,
  Observable,
  scheduled,
  Subject,
  asyncScheduler,
} from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService implements OnDestroy {
  private client: IClient;

  private sdkReady = new BehaviorSubject(false);
  public sdkReady$ = this.sdkReady.asObservable();

  private sdkUpdate = new Subject();
  public sdkUpdate$ = this.sdkUpdate.asObservable().pipe();

  constructor(@Inject(SplitSDK) splitSDK: ISDK) {
    this.client = splitSDK.client();
    this.client.on(this.client.Event.SDK_READY, () => {
      this.sdkReady.next(true);
      this.sdkUpdate.next();
    });
    this.client.on(this.client.Event.SDK_UPDATE, () => this.sdkUpdate.next());
  }

  initialise() {}

  getTreatment(splitName: string) {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatment(splitName))
    );
  }

  getTreatmentWithConfig(splitName: string, configuration: Attributes) {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatmentWithConfig(splitName, configuration))
    );
  }

  getTreatmentAsBoolean(splitName: string) {
    return this.getTreatment(splitName).pipe(
      map((treatment) => {
        if (treatment === 'on' || treatment === 'control') {
          return true;
        } else if (treatment === 'off') {
          return false;
        } else {
          throw new Error(
            `Treatment is not boolean equivilent. expected on/off received ${treatment}`
          );
        }
      })
    );
  }

  getMultipleTreatments(splitNames: string[]) {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatments(splitNames))
    );
  }

  getMultipleTreatmentsWithConfig(
    splitNames: string[],
    configuration: Attributes
  ) {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatmentsWithConfig(splitNames, configuration))
    );
  }

  createTreatmentUpdateListener(
    treatment: Observable<string | boolean | SplitIO.Treatments>
  ) {
    return this.sdkUpdate$.pipe(switchMap(() => treatment));
  }

  ngOnDestroy() {
    this.client.destroy();
  }
}
