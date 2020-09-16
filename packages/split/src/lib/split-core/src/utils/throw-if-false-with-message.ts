import { of, timer } from 'rxjs';
import { switchMap, mapTo } from 'rxjs/operators';

export const throwIfFalseWithMessage = (errorMessage: string) =>
  switchMap((value) => {
    if (value === false) {
      console.warn(`${errorMessage}, delaying by 100ms`);
      return timer(100).pipe(mapTo(value));
    } else {
      return of(value);
    }
  });
