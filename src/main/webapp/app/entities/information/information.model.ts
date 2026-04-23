import dayjs from 'dayjs/esm';
import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';
import { ICrise } from 'app/entities/crise/crise.model';

export interface IInformation {
  id: number;
  contenu?: string | null;
  horodatage?: dayjs.Dayjs | null;
  utilisateur?: IUtilisateur | null;
  crise?: ICrise | null;
}

export type NewInformation = Omit<IInformation, 'id'> & { id: null };
