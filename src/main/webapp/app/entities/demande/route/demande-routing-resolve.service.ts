import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDemande } from '../demande.model';
import { DemandeService } from '../service/demande.service';

const demandeResolve = (route: ActivatedRouteSnapshot): Observable<null | IDemande> => {
  const id = route.params.id;
  if (id) {
    return inject(DemandeService)
      .find(id)
      .pipe(
        mergeMap((demande: HttpResponse<IDemande>) => {
          if (demande.body) {
            return of(demande.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default demandeResolve;
