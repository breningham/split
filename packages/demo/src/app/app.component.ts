import { Component, OnInit } from '@angular/core';
import {
  FeatureFlagsService,
  SplitManagerService,
  UserTrackingService,
} from '@inghamdev/split/src/lib/split-core';
import { asapScheduler, scheduled } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'demo';
  booleanSplit$ = this.featureFlags
    .getTreatmentAsBoolean('test-split')
    .pipe(catchError(() => scheduled([false], asapScheduler)));
  splitStatus$ = this.featureFlags.sdkReady$.pipe(
    map((v) => (v ? 'ready' : 'not ready'))
  );
  continuousSplitUpdate$ = this.featureFlags.createTreatmentUpdateListener(
    this.featureFlags.getMultipleTreatments(['updated-split', 'test-split'])
  );

  splits$ = this.splitManager.listSplits();

  constructor(
    public featureFlags: FeatureFlagsService,
    public splitManager: SplitManagerService,
    public splitUserTracking: UserTrackingService
  ) {}

  ngOnInit(): void {
    this.splitUserTracking
      .track('demo_user', 'user', 'view', null, {
        'user-agent': window.navigator.userAgent,
      })
      .subscribe((eh) => console.log('tracking', eh));
  }
}
