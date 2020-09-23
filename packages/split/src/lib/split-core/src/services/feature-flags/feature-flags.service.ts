import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  Attributes,
  IClient,
  Treatments,
  TreatmentsWithConfig,
  TreatmentWithConfig,
} from '@splitsoftware/splitio/types/splitio';
import { throwIfSDKNotReady } from '../../utils/throwIfSDKNotReady';
import { SplitClient } from '../../providers';
import { Observable } from 'rxjs';
import { delay, map, retry, retryWhen, switchMap, take } from 'rxjs/operators';
import { mapTreatmentToBoolean } from '../../utils/mapTreatmentToBoolean';
import { BooleanSplits } from '../../models/BooleanSplit';
import { BaseSplitService } from '../base.service';
import { mapControlToValue } from '../../utils/mapControlToValue';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService extends BaseSplitService implements OnDestroy {
  constructor(@Inject(SplitClient) client: IClient) {
    super(client);
  }

  getTreatment(splitName: string, controlValue?: string): Observable<string> {
    return this.sdkReady$.pipe(
      throwIfSDKNotReady,
      map(() => this.client.getTreatment(splitName)),
      map(mapControlToValue(controlValue)),
      retryWhen((errors) => errors.pipe(delay(100), take(3)))
    );
  }

  getTreatmentWithConfig(
    splitName: string,
    configuration: Attributes
  ): Observable<TreatmentWithConfig> {
    return this.sdkReady$.pipe(
      throwIfSDKNotReady,
      map(() => this.client.getTreatmentWithConfig(splitName, configuration)),
      retryWhen((errors) => errors.pipe(delay(100), take(3)))
    );
  }

  getTreatmentAsBoolean(
    splitName: string,
    controlValue: boolean = true
  ): Observable<boolean> {
    return this.getTreatment(splitName).pipe(
      map(mapTreatmentToBoolean(controlValue))
    );
  }

  getMultipleBooleanTreatments(
    splitNames: string[],
    controlValue: boolean = true
  ): Observable<BooleanSplits> {
    return this.sdkReady$.pipe(
      throwIfSDKNotReady,
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
      ),
      retryWhen((errors) => errors.pipe(delay(100), take(3)))
    );
  }

  getMultipleTreatments(splitNames: string[]): Observable<Treatments> {
    return this.sdkReady$.pipe(
      throwIfSDKNotReady,
      map(() => this.client.getTreatments(splitNames)),
      retryWhen((errors) => errors.pipe(delay(100), take(3)))
    );
  }

  getMultipleTreatmentsWithConfig(
    splitNames: string[],
    configuration: Attributes
  ): Observable<TreatmentsWithConfig> {
    return this.sdkReady$.pipe(
      throwIfSDKNotReady,
      map(() => this.client.getTreatmentsWithConfig(splitNames, configuration)),
      retryWhen((errors) => errors.pipe(delay(100), take(3)))
    );
  }

  createTreatmentUpdateListener(
    treatment: Observable<string | boolean | SplitIO.Treatments>
  ): Observable<string | boolean | SplitIO.Treatments> {
    return this.sdkUpdate$.pipe(switchMap(() => treatment));
  }

  ngOnDestroy(): void {
    this.client.destroy();
  }
}
