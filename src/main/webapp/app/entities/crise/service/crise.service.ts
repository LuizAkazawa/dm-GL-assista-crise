import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICrise, NewCrise } from '../crise.model';

export type PartialUpdateCrise = Partial<ICrise> & Pick<ICrise, 'id'>;

type RestOf<T extends ICrise | NewCrise> = Omit<T, 'dateDebut' | 'dateFin'> & {
  dateDebut?: string | null;
  dateFin?: string | null;
};

export type RestCrise = RestOf<ICrise>;

export type NewRestCrise = RestOf<NewCrise>;

export type PartialUpdateRestCrise = RestOf<PartialUpdateCrise>;

export type EntityResponseType = HttpResponse<ICrise>;
export type EntityArrayResponseType = HttpResponse<ICrise[]>;

@Injectable({ providedIn: 'root' })
export class CriseService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/crises');

  create(crise: NewCrise): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(crise);
    return this.http.post<RestCrise>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(crise: ICrise): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(crise);
    return this.http
      .put<RestCrise>(`${this.resourceUrl}/${this.getCriseIdentifier(crise)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(crise: PartialUpdateCrise): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(crise);
    return this.http
      .patch<RestCrise>(`${this.resourceUrl}/${this.getCriseIdentifier(crise)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCrise>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCrise[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCriseIdentifier(crise: Pick<ICrise, 'id'>): number {
    return crise.id;
  }

  compareCrise(o1: Pick<ICrise, 'id'> | null, o2: Pick<ICrise, 'id'> | null): boolean {
    return o1 && o2 ? this.getCriseIdentifier(o1) === this.getCriseIdentifier(o2) : o1 === o2;
  }

  addCriseToCollectionIfMissing<Type extends Pick<ICrise, 'id'>>(
    criseCollection: Type[],
    ...crisesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const crises: Type[] = crisesToCheck.filter(isPresent);
    if (crises.length > 0) {
      const criseCollectionIdentifiers = criseCollection.map(criseItem => this.getCriseIdentifier(criseItem));
      const crisesToAdd = crises.filter(criseItem => {
        const criseIdentifier = this.getCriseIdentifier(criseItem);
        if (criseCollectionIdentifiers.includes(criseIdentifier)) {
          return false;
        }
        criseCollectionIdentifiers.push(criseIdentifier);
        return true;
      });
      return [...crisesToAdd, ...criseCollection];
    }
    return criseCollection;
  }

  protected convertDateFromClient<T extends ICrise | NewCrise | PartialUpdateCrise>(crise: T): RestOf<T> {
    return {
      ...crise,
      dateDebut: crise.dateDebut?.toJSON() ?? null,
      dateFin: crise.dateFin?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCrise: RestCrise): ICrise {
    return {
      ...restCrise,
      dateDebut: restCrise.dateDebut ? dayjs(restCrise.dateDebut) : undefined,
      dateFin: restCrise.dateFin ? dayjs(restCrise.dateFin) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCrise>): HttpResponse<ICrise> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCrise[]>): HttpResponse<ICrise[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
