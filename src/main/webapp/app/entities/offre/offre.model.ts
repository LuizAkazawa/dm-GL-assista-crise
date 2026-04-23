import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';
import { ICrise } from 'app/entities/crise/crise.model';

export interface IOffre {
  id: number;
  description?: string | null;
  geolocalisation?: string | null;
  isArchived?: boolean | null;
  utilisateur?: IUtilisateur | null;
  crise?: ICrise | null;
}

export type NewOffre = Omit<IOffre, 'id'> & { id: null };
