import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ICrise } from '../crise.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../crise.test-samples';

import { CriseService, RestCrise } from './crise.service';

const requireRestSample: RestCrise = {
  ...sampleWithRequiredData,
  dateDebut: sampleWithRequiredData.dateDebut?.toJSON(),
  dateFin: sampleWithRequiredData.dateFin?.toJSON(),
};

describe('Crise Service', () => {
  let service: CriseService;
  let httpMock: HttpTestingController;
  let expectedResult: ICrise | ICrise[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CriseService);
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

    it('should create a Crise', () => {
      const crise = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(crise).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Crise', () => {
      const crise = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(crise).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Crise', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Crise', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Crise', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCriseToCollectionIfMissing', () => {
      it('should add a Crise to an empty array', () => {
        const crise: ICrise = sampleWithRequiredData;
        expectedResult = service.addCriseToCollectionIfMissing([], crise);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(crise);
      });

      it('should not add a Crise to an array that contains it', () => {
        const crise: ICrise = sampleWithRequiredData;
        const criseCollection: ICrise[] = [
          {
            ...crise,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCriseToCollectionIfMissing(criseCollection, crise);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Crise to an array that doesn't contain it", () => {
        const crise: ICrise = sampleWithRequiredData;
        const criseCollection: ICrise[] = [sampleWithPartialData];
        expectedResult = service.addCriseToCollectionIfMissing(criseCollection, crise);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(crise);
      });

      it('should add only unique Crise to an array', () => {
        const criseArray: ICrise[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const criseCollection: ICrise[] = [sampleWithRequiredData];
        expectedResult = service.addCriseToCollectionIfMissing(criseCollection, ...criseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const crise: ICrise = sampleWithRequiredData;
        const crise2: ICrise = sampleWithPartialData;
        expectedResult = service.addCriseToCollectionIfMissing([], crise, crise2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(crise);
        expect(expectedResult).toContain(crise2);
      });

      it('should accept null and undefined values', () => {
        const crise: ICrise = sampleWithRequiredData;
        expectedResult = service.addCriseToCollectionIfMissing([], null, crise, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(crise);
      });

      it('should return initial array if no Crise is added', () => {
        const criseCollection: ICrise[] = [sampleWithRequiredData];
        expectedResult = service.addCriseToCollectionIfMissing(criseCollection, undefined, null);
        expect(expectedResult).toEqual(criseCollection);
      });
    });

    describe('compareCrise', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCrise(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 11332 };
        const entity2 = null;

        const compareResult1 = service.compareCrise(entity1, entity2);
        const compareResult2 = service.compareCrise(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 11332 };
        const entity2 = { id: 22123 };

        const compareResult1 = service.compareCrise(entity1, entity2);
        const compareResult2 = service.compareCrise(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 11332 };
        const entity2 = { id: 11332 };

        const compareResult1 = service.compareCrise(entity1, entity2);
        const compareResult2 = service.compareCrise(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
