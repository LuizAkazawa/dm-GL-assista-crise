import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IDemande } from '../demande.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../demande.test-samples';

import { DemandeService } from './demande.service';

const requireRestSample: IDemande = {
  ...sampleWithRequiredData,
};

describe('Demande Service', () => {
  let service: DemandeService;
  let httpMock: HttpTestingController;
  let expectedResult: IDemande | IDemande[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DemandeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Demande', () => {
      const demande = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(demande).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Demande', () => {
      const demande = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(demande).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Demande', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Demande', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Demande', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDemandeToCollectionIfMissing', () => {
      it('should add a Demande to an empty array', () => {
        const demande: IDemande = sampleWithRequiredData;
        expectedResult = service.addDemandeToCollectionIfMissing([], demande);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(demande);
      });

      it('should not add a Demande to an array that contains it', () => {
        const demande: IDemande = sampleWithRequiredData;
        const demandeCollection: IDemande[] = [
          {
            ...demande,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDemandeToCollectionIfMissing(demandeCollection, demande);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Demande to an array that doesn't contain it", () => {
        const demande: IDemande = sampleWithRequiredData;
        const demandeCollection: IDemande[] = [sampleWithPartialData];
        expectedResult = service.addDemandeToCollectionIfMissing(demandeCollection, demande);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(demande);
      });

      it('should add only unique Demande to an array', () => {
        const demandeArray: IDemande[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const demandeCollection: IDemande[] = [sampleWithRequiredData];
        expectedResult = service.addDemandeToCollectionIfMissing(demandeCollection, ...demandeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const demande: IDemande = sampleWithRequiredData;
        const demande2: IDemande = sampleWithPartialData;
        expectedResult = service.addDemandeToCollectionIfMissing([], demande, demande2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(demande);
        expect(expectedResult).toContain(demande2);
      });

      it('should accept null and undefined values', () => {
        const demande: IDemande = sampleWithRequiredData;
        expectedResult = service.addDemandeToCollectionIfMissing([], null, demande, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(demande);
      });

      it('should return initial array if no Demande is added', () => {
        const demandeCollection: IDemande[] = [sampleWithRequiredData];
        expectedResult = service.addDemandeToCollectionIfMissing(demandeCollection, undefined, null);
        expect(expectedResult).toEqual(demandeCollection);
      });
    });

    describe('compareDemande', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDemande(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 27574 };
        const entity2 = null;

        const compareResult1 = service.compareDemande(entity1, entity2);
        const compareResult2 = service.compareDemande(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 27574 };
        const entity2 = { id: 24127 };

        const compareResult1 = service.compareDemande(entity1, entity2);
        const compareResult2 = service.compareDemande(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 27574 };
        const entity2 = { id: 27574 };

        const compareResult1 = service.compareDemande(entity1, entity2);
        const compareResult2 = service.compareDemande(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
