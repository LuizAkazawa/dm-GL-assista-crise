import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICrise } from '../crise.model';
import { CriseService } from '../service/crise.service';

const criseResolve = (route: ActivatedRouteSnapshot): Observable<null | ICrise> => {
  const id = route.params.id;
  if (id) {
    return inject(CriseService)
      .find(id)
      .pipe(
        mergeMap((crise: HttpResponse<ICrise>) => {
          if (crise.body) {
            return of(crise.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default criseResolve;
