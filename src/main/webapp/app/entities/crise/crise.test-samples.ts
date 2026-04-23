import dayjs from 'dayjs/esm';

import { ICrise, NewCrise } from './crise.model';

export const sampleWithRequiredData: ICrise = {
  id: 26287,
  nom: 'quick past',
  nature: 'GLISSEMENT_DE_TERRAIN',
  dateDebut: dayjs('2026-04-22T10:55'),
};

export const sampleWithPartialData: ICrise = {
  id: 19835,
  nom: 'reprove entwine outrank',
  nature: 'INONDATION',
  dateDebut: dayjs('2026-04-22T09:31'),
  isActive: false,
};

export const sampleWithFullData: ICrise = {
  id: 6698,
  nom: 'helplessly emphasise',
  nature: 'ACCIDENT_INDUSTRIEL',
  dateDebut: dayjs('2026-04-23T07:01'),
  dateFin: dayjs('2026-04-22T21:52'),
  isActive: false,
};

export const sampleWithNewData: NewCrise = {
  nom: 'eulogise contrast',
  nature: 'GLISSEMENT_DE_TERRAIN',
  dateDebut: dayjs('2026-04-22T22:09'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
