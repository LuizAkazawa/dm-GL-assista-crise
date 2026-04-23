import { ICrise } from 'app/entities/crise/crise.model';

export interface IUtilisateur {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  email?: string | null;
  isBanned?: boolean | null;
  criseTouchees?: ICrise[] | null;
}

export type NewUtilisateur = Omit<IUtilisateur, 'id'> & { id: null };
