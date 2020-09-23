import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const throwIfSDKNotReady = switchMap((value) => {
  if (value === false) {
    throw new Error('Split SDK Not ready');
  } else {
    return of(value);
  }
});
