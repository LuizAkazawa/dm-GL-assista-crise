import { IOffre, NewOffre } from './offre.model';

export const sampleWithRequiredData: IOffre = {
  id: 11043,
  description: '../fake-data/blob/hipster.txt',
  geolocalisation: 'ick tune abscond',
};

export const sampleWithPartialData: IOffre = {
  id: 17112,
  description: '../fake-data/blob/hipster.txt',
  geolocalisation: 'repeatedly among slake',
};

export const sampleWithFullData: IOffre = {
  id: 14500,
  description: '../fake-data/blob/hipster.txt',
  geolocalisation: 'redevelop how boohoo',
  isArchived: true,
};

export const sampleWithNewData: NewOffre = {
  description: '../fake-data/blob/hipster.txt',
  geolocalisation: 'that',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
