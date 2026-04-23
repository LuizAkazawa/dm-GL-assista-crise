import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IOffre } from '../offre.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../offre.test-samples';

import { OffreService } from './offre.service';

const requireRestSample: IOffre = {
  ...sampleWithRequiredData,
};

describe('Offre Service', () => {
  let service: OffreService;
  let httpMock: HttpTestingController;
  let expectedResult: IOffre | IOffre[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(OffreService);
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

    it('should create a Offre', () => {
      const offre = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(offre).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Offre', () => {
      const offre = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(offre).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Offre', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Offre', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Offre', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOffreToCollectionIfMissing', () => {
      it('should add a Offre to an empty array', () => {
        const offre: IOffre = sampleWithRequiredData;
        expectedResult = service.addOffreToCollectionIfMissing([], offre);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offre);
      });

      it('should not add a Offre to an array that contains it', () => {
        const offre: IOffre = sampleWithRequiredData;
        const offreCollection: IOffre[] = [
          {
            ...offre,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOffreToCollectionIfMissing(offreCollection, offre);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Offre to an array that doesn't contain it", () => {
        const offre: IOffre = sampleWithRequiredData;
        const offreCollection: IOffre[] = [sampleWithPartialData];
        expectedResult = service.addOffreToCollectionIfMissing(offreCollection, offre);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offre);
      });

      it('should add only unique Offre to an array', () => {
        const offreArray: IOffre[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const offreCollection: IOffre[] = [sampleWithRequiredData];
        expectedResult = service.addOffreToCollectionIfMissing(offreCollection, ...offreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const offre: IOffre = sampleWithRequiredData;
        const offre2: IOffre = sampleWithPartialData;
        expectedResult = service.addOffreToCollectionIfMissing([], offre, offre2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(offre);
        expect(expectedResult).toContain(offre2);
      });

      it('should accept null and undefined values', () => {
        const offre: IOffre = sampleWithRequiredData;
        expectedResult = service.addOffreToCollectionIfMissing([], null, offre, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(offre);
      });

      it('should return initial array if no Offre is added', () => {
        const offreCollection: IOffre[] = [sampleWithRequiredData];
        expectedResult = service.addOffreToCollectionIfMissing(offreCollection, undefined, null);
        expect(expectedResult).toEqual(offreCollection);
      });
    });

    describe('compareOffre', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOffre(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 9345 };
        const entity2 = null;

        const compareResult1 = service.compareOffre(entity1, entity2);
        const compareResult2 = service.compareOffre(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 9345 };
        const entity2 = { id: 8458 };

        const compareResult1 = service.compareOffre(entity1, entity2);
        const compareResult2 = service.compareOffre(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 9345 };
        const entity2 = { id: 9345 };

        const compareResult1 = service.compareOffre(entity1, entity2);
        const compareResult2 = service.compareOffre(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
