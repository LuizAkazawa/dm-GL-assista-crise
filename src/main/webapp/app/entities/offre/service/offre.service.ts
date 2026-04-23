import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOffre, NewOffre } from '../offre.model';

export type PartialUpdateOffre = Partial<IOffre> & Pick<IOffre, 'id'>;

export type EntityResponseType = HttpResponse<IOffre>;
export type EntityArrayResponseType = HttpResponse<IOffre[]>;

@Injectable({ providedIn: 'root' })
export class OffreService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/offres');

  create(offre: NewOffre): Observable<EntityResponseType> {
    return this.http.post<IOffre>(this.resourceUrl, offre, { observe: 'response' });
  }

  update(offre: IOffre): Observable<EntityResponseType> {
    return this.http.put<IOffre>(`${this.resourceUrl}/${this.getOffreIdentifier(offre)}`, offre, { observe: 'response' });
  }

  partialUpdate(offre: PartialUpdateOffre): Observable<EntityResponseType> {
    return this.http.patch<IOffre>(`${this.resourceUrl}/${this.getOffreIdentifier(offre)}`, offre, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOffre>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOffre[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOffreIdentifier(offre: Pick<IOffre, 'id'>): number {
    return offre.id;
  }

  compareOffre(o1: Pick<IOffre, 'id'> | null, o2: Pick<IOffre, 'id'> | null): boolean {
    return o1 && o2 ? this.getOffreIdentifier(o1) === this.getOffreIdentifier(o2) : o1 === o2;
  }

  addOffreToCollectionIfMissing<Type extends Pick<IOffre, 'id'>>(
    offreCollection: Type[],
    ...offresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const offres: Type[] = offresToCheck.filter(isPresent);
    if (offres.length > 0) {
      const offreCollectionIdentifiers = offreCollection.map(offreItem => this.getOffreIdentifier(offreItem));
      const offresToAdd = offres.filter(offreItem => {
        const offreIdentifier = this.getOffreIdentifier(offreItem);
        if (offreCollectionIdentifiers.includes(offreIdentifier)) {
          return false;
        }
        offreCollectionIdentifiers.push(offreIdentifier);
        return true;
      });
      return [...offresToAdd, ...offreCollection];
    }
    return offreCollection;
  }
}
