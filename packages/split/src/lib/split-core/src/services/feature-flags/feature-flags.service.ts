import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  AsyncTreatmentsWithConfig,
  Attributes,
  IClient,
  Treatments,
  TreatmentsWithConfig,
  TreatmentWithConfig,
} from '@splitsoftware/splitio/types/splitio';
import { throwIfFalseWithMessage } from '../../utils/throw-if-false-with-message';
import { SplitClient } from '../../providers';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { mapTreatmentToBoolean } from '../../utils/mapToBoolean';
import { BooleanSplits } from '../../models/BooleanSplit';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService implements OnDestroy {
  private sdkReady = new BehaviorSubject(false);
  public sdkReady$ = this.sdkReady.asObservable();

  private sdkUpdate = new Subject();
  public sdkUpdate$ = this.sdkUpdate.asObservable();

  constructor(@Inject(SplitClient) private client: IClient) {
    this.client.on(this.client.Event.SDK_READY, () => {
      this.sdkReady.next(true);
      this.sdkUpdate.next();
    });
    this.client.on(this.client.Event.SDK_UPDATE, () => this.sdkUpdate.next());
  }

  getTreatment(splitName: string, controlValue?: string): Observable<string> {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatment(splitName)),
      map((treatment: string) =>
        treatment === 'control' ? controlValue : treatment
      )
    );
  }

  getTreatmentWithConfig(
    splitName: string,
    configuration: Attributes
  ): Observable<TreatmentWithConfig> {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatmentWithConfig(splitName, configuration))
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

  getMultipleTreatments(splitNames: string[]): Observable<Treatments> {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatments(splitNames))
    );
  }

  getMultipleTreatmentsWithConfig(
    splitNames: string[],
    configuration: Attributes
  ): Observable<TreatmentsWithConfig> {
    return this.sdkReady$.pipe(
      throwIfFalseWithMessage('Split client not ready'),
      map(() => this.client.getTreatmentsWithConfig(splitNames, configuration))
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
