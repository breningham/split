import { Injectable, SkipSelf } from '@angular/core';
import { ActivatedRouteSnapshot, Data, Resolve } from '@angular/router';
import { Treatments } from '@splitsoftware/splitio/types/splitio';
import { FeatureFlagsService } from '../services/feature-flags/feature-flags.service';

export interface TreatmentResolverData extends Data {
  // Names of Splits
  resolveFeatureFlagValues: string[];
}

@Injectable({ providedIn: 'any' })
export class TreatmentResolver implements Resolve<Treatments> {
  constructor(@SkipSelf() private featureFlags: FeatureFlagsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const {
      resolveFeatureFlagValues: flags,
    } = route.data as TreatmentResolverData;

    if (
      !flags ||
      !Array.isArray(flags) ||
      (Array.isArray(flags) && flags.length === 0)
    ) {
      return {}; // No Flags, no treatments
    }

    return this.featureFlags.getMultipleTreatments(flags);
  }
}
