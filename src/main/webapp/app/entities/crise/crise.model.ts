import dayjs from 'dayjs/esm';
import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';
import { TypeCrise } from 'app/entities/enumerations/type-crise.model';

export interface ICrise {
  id: number;
  nom?: string | null;
  nature?: keyof typeof TypeCrise | null;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  isActive?: boolean | null;
  sinistres?: IUtilisateur[] | null;
}

export type NewCrise = Omit<ICrise, 'id'> & { id: null };
