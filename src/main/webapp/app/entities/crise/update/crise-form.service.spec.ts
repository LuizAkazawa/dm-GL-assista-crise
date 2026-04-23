import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../crise.test-samples';

import { CriseFormService } from './crise-form.service';

describe('Crise Form Service', () => {
  let service: CriseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriseFormService);
  });

  describe('Service methods', () => {
    describe('createCriseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCriseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            nature: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            isActive: expect.any(Object),
            sinistres: expect.any(Object),
          }),
        );
      });

      it('passing ICrise should create a new form with FormGroup', () => {
        const formGroup = service.createCriseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            nature: expect.any(Object),
            dateDebut: expect.any(Object),
            dateFin: expect.any(Object),
            isActive: expect.any(Object),
            sinistres: expect.any(Object),
          }),
        );
      });
    });

    describe('getCrise', () => {
      it('should return NewCrise for default Crise initial value', () => {
        const formGroup = service.createCriseFormGroup(sampleWithNewData);

        const crise = service.getCrise(formGroup) as any;

        expect(crise).toMatchObject(sampleWithNewData);
      });

      it('should return NewCrise for empty Crise initial value', () => {
        const formGroup = service.createCriseFormGroup();

        const crise = service.getCrise(formGroup) as any;

        expect(crise).toMatchObject({});
      });

      it('should return ICrise', () => {
        const formGroup = service.createCriseFormGroup(sampleWithRequiredData);

        const crise = service.getCrise(formGroup) as any;

        expect(crise).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICrise should not enable id FormControl', () => {
        const formGroup = service.createCriseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCrise should disable id FormControl', () => {
        const formGroup = service.createCriseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
