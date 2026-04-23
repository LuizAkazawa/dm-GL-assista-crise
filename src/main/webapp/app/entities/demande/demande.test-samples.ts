import { IDemande, NewDemande } from './demande.model';

export const sampleWithRequiredData: IDemande = {
  id: 12976,
  description: '../fake-data/blob/hipster.txt',
  typeBesoin: 'tightly',
  geolocalisation: 'absent',
  statut: 'RESOLUE',
};

export const sampleWithPartialData: IDemande = {
  id: 11739,
  description: '../fake-data/blob/hipster.txt',
  typeBesoin: 'internationalize mean',
  geolocalisation: 'lazily',
  statut: 'FERMEE',
  isArchived: false,
};

export const sampleWithFullData: IDemande = {
  id: 5647,
  description: '../fake-data/blob/hipster.txt',
  typeBesoin: 'ack adventurously charming',
  geolocalisation: 'um partridge',
  statut: 'RESOLUE',
  isArchived: false,
};

export const sampleWithNewData: NewDemande = {
  description: '../fake-data/blob/hipster.txt',
  typeBesoin: 'er impeccable',
  geolocalisation: 'once yowza finding',
  statut: 'RESOLUE',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
