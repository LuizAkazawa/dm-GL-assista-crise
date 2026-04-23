import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUtilisateur, NewUtilisateur } from '../utilisateur.model';

export type PartialUpdateUtilisateur = Partial<IUtilisateur> & Pick<IUtilisateur, 'id'>;

export type EntityResponseType = HttpResponse<IUtilisateur>;
export type EntityArrayResponseType = HttpResponse<IUtilisateur[]>;

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/utilisateurs');

  create(utilisateur: NewUtilisateur): Observable<EntityResponseType> {
    return this.http.post<IUtilisateur>(this.resourceUrl, utilisateur, { observe: 'response' });
  }

  update(utilisateur: IUtilisateur): Observable<EntityResponseType> {
    return this.http.put<IUtilisateur>(`${this.resourceUrl}/${this.getUtilisateurIdentifier(utilisateur)}`, utilisateur, {
      observe: 'response',
    });
  }

  partialUpdate(utilisateur: PartialUpdateUtilisateur): Observable<EntityResponseType> {
    return this.http.patch<IUtilisateur>(`${this.resourceUrl}/${this.getUtilisateurIdentifier(utilisateur)}`, utilisateur, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUtilisateur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUtilisateur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUtilisateurIdentifier(utilisateur: Pick<IUtilisateur, 'id'>): number {
    return utilisateur.id;
  }

  compareUtilisateur(o1: Pick<IUtilisateur, 'id'> | null, o2: Pick<IUtilisateur, 'id'> | null): boolean {
    return o1 && o2 ? this.getUtilisateurIdentifier(o1) === this.getUtilisateurIdentifier(o2) : o1 === o2;
  }

  addUtilisateurToCollectionIfMissing<Type extends Pick<IUtilisateur, 'id'>>(
    utilisateurCollection: Type[],
    ...utilisateursToCheck: (Type | null | undefined)[]
  ): Type[] {
    const utilisateurs: Type[] = utilisateursToCheck.filter(isPresent);
    if (utilisateurs.length > 0) {
      const utilisateurCollectionIdentifiers = utilisateurCollection.map(utilisateurItem => this.getUtilisateurIdentifier(utilisateurItem));
      const utilisateursToAdd = utilisateurs.filter(utilisateurItem => {
        const utilisateurIdentifier = this.getUtilisateurIdentifier(utilisateurItem);
        if (utilisateurCollectionIdentifiers.includes(utilisateurIdentifier)) {
          return false;
        }
        utilisateurCollectionIdentifiers.push(utilisateurIdentifier);
        return true;
      });
      return [...utilisateursToAdd, ...utilisateurCollection];
    }
    return utilisateurCollection;
  }
}
