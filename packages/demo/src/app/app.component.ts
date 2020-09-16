import { Component } from '@angular/core';
import { FeatureFlagsService } from '@inghamdev/split/src/lib/split-core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'demo';
  booleanSplit$ = this.featureFlags.getTreatmentAsBoolean('test-split');
  splitStatus$ = this.featureFlags.sdkReady$.pipe(
    map((v) => (v ? 'ready' : 'not ready'))
  );
  continuousSplitUpdate$ = this.featureFlags.createTreatmentUpdateListener(
    this.featureFlags.getMultipleTreatments(['updated-split', 'test-split'])
  );

  constructor(public featureFlags: FeatureFlagsService) {}
}
