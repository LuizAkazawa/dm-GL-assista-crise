import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IUtilisateur } from '../utilisateur.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../utilisateur.test-samples';

import { UtilisateurService } from './utilisateur.service';

const requireRestSample: IUtilisateur = {
  ...sampleWithRequiredData,
};

describe('Utilisateur Service', () => {
  let service: UtilisateurService;
  let httpMock: HttpTestingController;
  let expectedResult: IUtilisateur | IUtilisateur[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(UtilisateurService);
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

    it('should create a Utilisateur', () => {
      const utilisateur = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(utilisateur).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Utilisateur', () => {
      const utilisateur = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(utilisateur).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Utilisateur', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Utilisateur', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Utilisateur', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUtilisateurToCollectionIfMissing', () => {
      it('should add a Utilisateur to an empty array', () => {
        const utilisateur: IUtilisateur = sampleWithRequiredData;
        expectedResult = service.addUtilisateurToCollectionIfMissing([], utilisateur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(utilisateur);
      });

      it('should not add a Utilisateur to an array that contains it', () => {
        const utilisateur: IUtilisateur = sampleWithRequiredData;
        const utilisateurCollection: IUtilisateur[] = [
          {
            ...utilisateur,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUtilisateurToCollectionIfMissing(utilisateurCollection, utilisateur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Utilisateur to an array that doesn't contain it", () => {
        const utilisateur: IUtilisateur = sampleWithRequiredData;
        const utilisateurCollection: IUtilisateur[] = [sampleWithPartialData];
        expectedResult = service.addUtilisateurToCollectionIfMissing(utilisateurCollection, utilisateur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(utilisateur);
      });

      it('should add only unique Utilisateur to an array', () => {
        const utilisateurArray: IUtilisateur[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const utilisateurCollection: IUtilisateur[] = [sampleWithRequiredData];
        expectedResult = service.addUtilisateurToCollectionIfMissing(utilisateurCollection, ...utilisateurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const utilisateur: IUtilisateur = sampleWithRequiredData;
        const utilisateur2: IUtilisateur = sampleWithPartialData;
        expectedResult = service.addUtilisateurToCollectionIfMissing([], utilisateur, utilisateur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(utilisateur);
        expect(expectedResult).toContain(utilisateur2);
      });

      it('should accept null and undefined values', () => {
        const utilisateur: IUtilisateur = sampleWithRequiredData;
        expectedResult = service.addUtilisateurToCollectionIfMissing([], null, utilisateur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(utilisateur);
      });

      it('should return initial array if no Utilisateur is added', () => {
        const utilisateurCollection: IUtilisateur[] = [sampleWithRequiredData];
        expectedResult = service.addUtilisateurToCollectionIfMissing(utilisateurCollection, undefined, null);
        expect(expectedResult).toEqual(utilisateurCollection);
      });
    });

    describe('compareUtilisateur', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUtilisateur(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 2179 };
        const entity2 = null;

        const compareResult1 = service.compareUtilisateur(entity1, entity2);
        const compareResult2 = service.compareUtilisateur(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 2179 };
        const entity2 = { id: 31928 };

        const compareResult1 = service.compareUtilisateur(entity1, entity2);
        const compareResult2 = service.compareUtilisateur(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 2179 };
        const entity2 = { id: 2179 };

        const compareResult1 = service.compareUtilisateur(entity1, entity2);
        const compareResult2 = service.compareUtilisateur(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
