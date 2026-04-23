import { IUtilisateur, NewUtilisateur } from './utilisateur.model';

export const sampleWithRequiredData: IUtilisateur = {
  id: 7635,
  nom: 'whirlwind optimistically',
  prenom: 'inwardly',
  email: '=X@-t\\yI5.lDbh',
};

export const sampleWithPartialData: IUtilisateur = {
  id: 19905,
  nom: 'pertinent opposite gurn',
  prenom: 'submitter tomography',
  email: '>T=7|@Dc.SQQP',
};

export const sampleWithFullData: IUtilisateur = {
  id: 18250,
  nom: 'since across',
  prenom: 'sizzle',
  email: '{,k(<@5("Q.$YJ_n',
  isBanned: false,
};

export const sampleWithNewData: NewUtilisateur = {
  nom: 'hot',
  prenom: 'even coarse',
  email: 'b7co@VGRbIO.u`mJr',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
