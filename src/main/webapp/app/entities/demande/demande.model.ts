import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';
import { ICrise } from 'app/entities/crise/crise.model';
import { StatutDemande } from 'app/entities/enumerations/statut-demande.model';

export interface IDemande {
  id: number;
  description?: string | null;
  typeBesoin?: string | null;
  geolocalisation?: string | null;
  statut?: keyof typeof StatutDemande | null;
  isArchived?: boolean | null;
  utilisateur?: IUtilisateur | null;
  crise?: ICrise | null;
}

export type NewDemande = Omit<IDemande, 'id'> & { id: null };
