import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOffre } from '../offre.model';
import { OffreService } from '../service/offre.service';

const offreResolve = (route: ActivatedRouteSnapshot): Observable<null | IOffre> => {
  const id = route.params.id;
  if (id) {
    return inject(OffreService)
      .find(id)
      .pipe(
        mergeMap((offre: HttpResponse<IOffre>) => {
          if (offre.body) {
            return of(offre.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default offreResolve;
