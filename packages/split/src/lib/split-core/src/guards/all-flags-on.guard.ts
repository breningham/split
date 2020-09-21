import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { FeatureFlagsService } from '../services/feature-flags/feature-flags.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CanNavigateData {
  /**
   * What flags to use
   * @default undefined // Will Throw an Error if not provided.
   */
  flags: string[];
  /**
   * What URL to use if Flags are Off/Falsy
   * @default ['/'] // Redirect to Root of Application.
   */
  redirectTo?: string[];
  /**
   * What Value to emulate when 'control' is received.
   * @default true
   */
  controlValue?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AllFlagsOnGuard implements CanActivate {
  constructor(
    private featureFlagsService: FeatureFlagsService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const routeData = route.data as CanNavigateData;

    if (routeData.flags === undefined) {
      throw new Error('Flags are not set correctly');
    }

    return this.featureFlagsService
      .getMultipleBooleanTreatments(
        routeData.flags,
        routeData.controlValue || true
      )
      .pipe(
        map((values) => Object.values(values).every(Boolean)),
        map((areAllFlagsOn) => {
          if (areAllFlagsOn === true) {
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
