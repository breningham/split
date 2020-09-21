import { ActivatedRouteSnapshot, Data, Resolve } from '@angular/router';
import { Observable, asapScheduler, scheduled } from 'rxjs';

import { FeatureFlagsService } from '../services/feature-flags/feature-flags.service';
import { Injectable } from '@angular/core';
import { Treatments } from '@splitsoftware/splitio/types/splitio';

export interface TreatmentResolverData extends Data {
  // Names of Splits
  resolveFeatureFlagValues: string[];
}

@Injectable({ providedIn: 'any' })
export class TreatmentResolver implements Resolve<Treatments> {
  constructor(private featureFlags: FeatureFlagsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Treatments> {
    const {
      resolveFeatureFlagValues: flags,
    } = route.data as TreatmentResolverData;

    if (
      !flags ||
      !Array.isArray(flags) ||
      (Array.isArray(flags) && flags.length === 0)
    ) {
      return scheduled([{}], asapScheduler); // No Flags, no treatments
    }

    return this.featureFlags.getMultipleTreatments(flags);
  }
}
