import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../information.test-samples';

import { InformationFormService } from './information-form.service';

describe('Information Form Service', () => {
  let service: InformationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationFormService);
  });

  describe('Service methods', () => {
    describe('createInformationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInformationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            contenu: expect.any(Object),
            horodatage: expect.any(Object),
            utilisateur: expect.any(Object),
            crise: expect.any(Object),
          }),
        );
      });

      it('passing IInformation should create a new form with FormGroup', () => {
        const formGroup = service.createInformationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            contenu: expect.any(Object),
            horodatage: expect.any(Object),
            utilisateur: expect.any(Object),
            crise: expect.any(Object),
          }),
        );
      });
    });

    describe('getInformation', () => {
      it('should return NewInformation for default Information initial value', () => {
        const formGroup = service.createInformationFormGroup(sampleWithNewData);

        const information = service.getInformation(formGroup) as any;

        expect(information).toMatchObject(sampleWithNewData);
      });

      it('should return NewInformation for empty Information initial value', () => {
        const formGroup = service.createInformationFormGroup();

        const information = service.getInformation(formGroup) as any;

        expect(information).toMatchObject({});
      });

      it('should return IInformation', () => {
        const formGroup = service.createInformationFormGroup(sampleWithRequiredData);

        const information = service.getInformation(formGroup) as any;

        expect(information).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInformation should not enable id FormControl', () => {
        const formGroup = service.createInformationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInformation should disable id FormControl', () => {
        const formGroup = service.createInformationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
