import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInformation, NewInformation } from '../information.model';

export type PartialUpdateInformation = Partial<IInformation> & Pick<IInformation, 'id'>;

type RestOf<T extends IInformation | NewInformation> = Omit<T, 'horodatage'> & {
  horodatage?: string | null;
};

export type RestInformation = RestOf<IInformation>;

export type NewRestInformation = RestOf<NewInformation>;

export type PartialUpdateRestInformation = RestOf<PartialUpdateInformation>;

export type EntityResponseType = HttpResponse<IInformation>;
export type EntityArrayResponseType = HttpResponse<IInformation[]>;

@Injectable({ providedIn: 'root' })
export class InformationService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/information');

  create(information: NewInformation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(information);
    return this.http
      .post<RestInformation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(information: IInformation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(information);
    return this.http
      .put<RestInformation>(`${this.resourceUrl}/${this.getInformationIdentifier(information)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(information: PartialUpdateInformation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(information);
    return this.http
      .patch<RestInformation>(`${this.resourceUrl}/${this.getInformationIdentifier(information)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInformation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInformation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInformationIdentifier(information: Pick<IInformation, 'id'>): number {
    return information.id;
  }

  compareInformation(o1: Pick<IInformation, 'id'> | null, o2: Pick<IInformation, 'id'> | null): boolean {
    return o1 && o2 ? this.getInformationIdentifier(o1) === this.getInformationIdentifier(o2) : o1 === o2;
  }

  addInformationToCollectionIfMissing<Type extends Pick<IInformation, 'id'>>(
    informationCollection: Type[],
    ...informationToCheck: (Type | null | undefined)[]
  ): Type[] {
    const information: Type[] = informationToCheck.filter(isPresent);
    if (information.length > 0) {
      const informationCollectionIdentifiers = informationCollection.map(informationItem => this.getInformationIdentifier(informationItem));
      const informationToAdd = information.filter(informationItem => {
        const informationIdentifier = this.getInformationIdentifier(informationItem);
        if (informationCollectionIdentifiers.includes(informationIdentifier)) {
          return false;
        }
        informationCollectionIdentifiers.push(informationIdentifier);
        return true;
      });
      return [...informationToAdd, ...informationCollection];
    }
    return informationCollection;
  }

  protected convertDateFromClient<T extends IInformation | NewInformation | PartialUpdateInformation>(information: T): RestOf<T> {
    return {
      ...information,
      horodatage: information.horodatage?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restInformation: RestInformation): IInformation {
    return {
      ...restInformation,
      horodatage: restInformation.horodatage ? dayjs(restInformation.horodatage) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInformation>): HttpResponse<IInformation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInformation[]>): HttpResponse<IInformation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
