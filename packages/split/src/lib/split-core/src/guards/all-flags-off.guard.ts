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

export interface AllFlagsOffData extends Data {
  /**
   * What flags to use
   */
  flags: string[];
  /**
   * What URL to use if Flags are Off/Falsy
   */
  redirectTo?: string[];
  /**
   * What Value to emulate when 'control' is received.
   */
  controlValue?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AllFlagsOffGuard implements CanActivate {
  constructor(
    private featureFlagsService: FeatureFlagsService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const routeData = route.data as AllFlagsOffData;

    if (routeData.flags === undefined) {
      throw new Error('Flags are not set correctly');
    }

    return this.featureFlagsService
      .getMultipleBooleanTreatments(
        routeData.flags,
        routeData.controlValue || false
      )
      .pipe(
        map((values) => Object.values(values).every(Boolean)),
        map((areAllFlagsOn) => {
          if (areAllFlagsOn === false) {
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
