import dayjs from 'dayjs/esm';

import { IInformation, NewInformation } from './information.model';

export const sampleWithRequiredData: IInformation = {
  id: 30844,
  contenu: '../fake-data/blob/hipster.txt',
  horodatage: dayjs('2026-04-23T08:03'),
};

export const sampleWithPartialData: IInformation = {
  id: 30449,
  contenu: '../fake-data/blob/hipster.txt',
  horodatage: dayjs('2026-04-22T08:58'),
};

export const sampleWithFullData: IInformation = {
  id: 23818,
  contenu: '../fake-data/blob/hipster.txt',
  horodatage: dayjs('2026-04-22T09:28'),
};

export const sampleWithNewData: NewInformation = {
  contenu: '../fake-data/blob/hipster.txt',
  horodatage: dayjs('2026-04-23T02:30'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
