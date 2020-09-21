import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  Attributes,
  IBrowserSettings,
  IClient,
  ISDK,
} from '@splitsoftware/splitio/types/splitio';
import { throwIfFalseWithMessage } from '../../utils/throw-if-false-with-message';
import { SplitClient, SplitConfiguration, SplitSDK } from '../../providers';
import {
  BehaviorSubject,
  Observable,
  Subject,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { mapTreatmentToBoolean } from '../../utils/mapToBoolean';
import { BooleanSplits } from '../../models/BooleanSplit';
import { SplitFactory } from '@splitsoftware/splitio';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService implements OnDestroy {
  private sdkReady = new BehaviorSubject(false);
  public sdkReady$ = this.sdkReady.asObservable();

  private sdkUpdate = new Subject();
  public sdkUpdate$ = this.sdkUpdate.asObservable().pipe();

  constructor(@Inject(SplitClient) private client: IClient, @Inject(SplitConfiguration) private configuration: IBrowserSettings) {
    this.client.on(this.client.Event.SDK_READY, () => {
      this.sdkReady.next(true);
      this.sdkUpdate.next();
    });
    this.client.on(this.client.Event.SDK_UPDATE, () => this.sdkUpdate.next());
  }

  initialiseNewClient( configuration: Partial<IBrowserSettings> ) {
    const newSDKConfig = Object.assign({}, this.configuration, configuration);
    return SplitFactory(newSDKConfig);
  }

  getTreatment(splitName: string, controlValue?: string) {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatment(splitName)),
      map((treatment: string) =>
        treatment === 'control' ? controlValue : treatment
      )
    );
  }

  getTreatmentWithConfig(splitName: string, configuration: Attributes) {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatmentWithConfig(splitName, configuration))
    );
  }

  getTreatmentAsBoolean(splitName: string, controlValue: boolean = true) {
    return this.getTreatment(splitName).pipe(
      map(mapTreatmentToBoolean(controlValue))
    );
  }

  getMultipleBooleanTreatments(
    splitNames: string[],
    controlValue: boolean = true
  ) {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatments(splitNames)),
      map((treatments) => Object.entries(treatments)),
      map((treatments) =>
        treatments
          .map(
            ([split, treatment]): BooleanSplits => ({
              [split]: mapTreatmentToBoolean(controlValue)(treatment),
            })
          )
          .reduce<BooleanSplits>((a, t) => ({ ...a, ...t }), {})
      )
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
