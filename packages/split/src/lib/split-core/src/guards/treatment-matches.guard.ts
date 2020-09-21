import {
  ActivatedRouteSnapshot,
  CanActivate,
  Data,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { FeatureFlagsService } from '../services/feature-flags/feature-flags.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TreatmentMatchesData extends Data {
  /**
   * What split to use
   */
  flag: string;
  /***
   * What treatment to use
   */
  expectedTreatment: string;
  /**
   * What URL to use if Flags are Off/Falsy
   */
  redirectTo?: string[];
  /**
   * What Value to emulate when 'control' is received.
   */
  controlValue?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TreatmentMatchesGuard implements CanActivate {
  constructor(
    private featureFlagsService: FeatureFlagsService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const routeData = route.data as TreatmentMatchesData;

    if (routeData.flag === undefined) {
      throw new Error('Flags are not set correctly');
    }
    if (routeData.expectedTreatment === undefined) {
      console.warn(
        'Expected Treatment is undefined, probably not what you want.'
      );
    }

    return this.featureFlagsService
      .getTreatment(routeData.flag, routeData.controlValue)
      .pipe(
        map((treatment) => {
          if (treatment === routeData.expectedTreatment) {
            return true;
          } else {
            if (routeData.redirectTo) {
              return this.router.createUrlTree(routeData.redirectTo);
            } else {
              return this.router.createUrlTree(['/']);
            }
          }
        })
      );
  }
}
