import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICrise, NewCrise } from '../crise.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICrise for edit and NewCriseFormGroupInput for create.
 */
type CriseFormGroupInput = ICrise | PartialWithRequiredKeyOf<NewCrise>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICrise | NewCrise> = Omit<T, 'dateDebut' | 'dateFin'> & {
  dateDebut?: string | null;
  dateFin?: string | null;
};

type CriseFormRawValue = FormValueOf<ICrise>;

type NewCriseFormRawValue = FormValueOf<NewCrise>;

type CriseFormDefaults = Pick<NewCrise, 'id' | 'dateDebut' | 'dateFin' | 'isActive' | 'sinistres'>;

type CriseFormGroupContent = {
  id: FormControl<CriseFormRawValue['id'] | NewCrise['id']>;
  nom: FormControl<CriseFormRawValue['nom']>;
  nature: FormControl<CriseFormRawValue['nature']>;
  dateDebut: FormControl<CriseFormRawValue['dateDebut']>;
  dateFin: FormControl<CriseFormRawValue['dateFin']>;
  isActive: FormControl<CriseFormRawValue['isActive']>;
  sinistres: FormControl<CriseFormRawValue['sinistres']>;
};

export type CriseFormGroup = FormGroup<CriseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CriseFormService {
  createCriseFormGroup(crise: CriseFormGroupInput = { id: null }): CriseFormGroup {
    const criseRawValue = this.convertCriseToCriseRawValue({
      ...this.getFormDefaults(),
      ...crise,
    });
    return new FormGroup<CriseFormGroupContent>({
      id: new FormControl(
        { value: criseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(criseRawValue.nom, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      nature: new FormControl(criseRawValue.nature, {
        validators: [Validators.required],
      }),
      dateDebut: new FormControl(criseRawValue.dateDebut, {
        validators: [Validators.required],
      }),
      dateFin: new FormControl(criseRawValue.dateFin),
      isActive: new FormControl(criseRawValue.isActive),
      sinistres: new FormControl(criseRawValue.sinistres ?? []),
    });
  }

  getCrise(form: CriseFormGroup): ICrise | NewCrise {
    return this.convertCriseRawValueToCrise(form.getRawValue() as CriseFormRawValue | NewCriseFormRawValue);
  }

  resetForm(form: CriseFormGroup, crise: CriseFormGroupInput): void {
    const criseRawValue = this.convertCriseToCriseRawValue({ ...this.getFormDefaults(), ...crise });
    form.reset(
      {
        ...criseRawValue,
        id: { value: criseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CriseFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateDebut: currentTime,
      dateFin: currentTime,
      isActive: false,
      sinistres: [],
    };
  }

  private convertCriseRawValueToCrise(rawCrise: CriseFormRawValue | NewCriseFormRawValue): ICrise | NewCrise {
    return {
      ...rawCrise,
      dateDebut: dayjs(rawCrise.dateDebut, DATE_TIME_FORMAT),
      dateFin: dayjs(rawCrise.dateFin, DATE_TIME_FORMAT),
    };
  }

  private convertCriseToCriseRawValue(
    crise: ICrise | (Partial<NewCrise> & CriseFormDefaults),
  ): CriseFormRawValue | PartialWithRequiredKeyOf<NewCriseFormRawValue> {
    return {
      ...crise,
      dateDebut: crise.dateDebut ? crise.dateDebut.format(DATE_TIME_FORMAT) : undefined,
      dateFin: crise.dateFin ? crise.dateFin.format(DATE_TIME_FORMAT) : undefined,
      sinistres: crise.sinistres ?? [],
    };
  }
}
