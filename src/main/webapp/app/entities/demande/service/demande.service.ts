import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDemande, NewDemande } from '../demande.model';

export type PartialUpdateDemande = Partial<IDemande> & Pick<IDemande, 'id'>;

export type EntityResponseType = HttpResponse<IDemande>;
export type EntityArrayResponseType = HttpResponse<IDemande[]>;

@Injectable({ providedIn: 'root' })
export class DemandeService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/demandes');

  create(demande: NewDemande): Observable<EntityResponseType> {
    return this.http.post<IDemande>(this.resourceUrl, demande, { observe: 'response' });
  }

  update(demande: IDemande): Observable<EntityResponseType> {
    return this.http.put<IDemande>(`${this.resourceUrl}/${this.getDemandeIdentifier(demande)}`, demande, { observe: 'response' });
  }

  partialUpdate(demande: PartialUpdateDemande): Observable<EntityResponseType> {
    return this.http.patch<IDemande>(`${this.resourceUrl}/${this.getDemandeIdentifier(demande)}`, demande, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDemande>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDemande[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDemandeIdentifier(demande: Pick<IDemande, 'id'>): number {
    return demande.id;
  }

  compareDemande(o1: Pick<IDemande, 'id'> | null, o2: Pick<IDemande, 'id'> | null): boolean {
    return o1 && o2 ? this.getDemandeIdentifier(o1) === this.getDemandeIdentifier(o2) : o1 === o2;
  }

  addDemandeToCollectionIfMissing<Type extends Pick<IDemande, 'id'>>(
    demandeCollection: Type[],
    ...demandesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const demandes: Type[] = demandesToCheck.filter(isPresent);
    if (demandes.length > 0) {
      const demandeCollectionIdentifiers = demandeCollection.map(demandeItem => this.getDemandeIdentifier(demandeItem));
      const demandesToAdd = demandes.filter(demandeItem => {
        const demandeIdentifier = this.getDemandeIdentifier(demandeItem);
        if (demandeCollectionIdentifiers.includes(demandeIdentifier)) {
          return false;
        }
        demandeCollectionIdentifiers.push(demandeIdentifier);
        return true;
      });
      return [...demandesToAdd, ...demandeCollection];
    }
    return demandeCollection;
  }
}
