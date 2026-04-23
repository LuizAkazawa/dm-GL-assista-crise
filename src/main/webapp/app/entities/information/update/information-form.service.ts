import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInformation, NewInformation } from '../information.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInformation for edit and NewInformationFormGroupInput for create.
 */
type InformationFormGroupInput = IInformation | PartialWithRequiredKeyOf<NewInformation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInformation | NewInformation> = Omit<T, 'horodatage'> & {
  horodatage?: string | null;
};

type InformationFormRawValue = FormValueOf<IInformation>;

type NewInformationFormRawValue = FormValueOf<NewInformation>;

type InformationFormDefaults = Pick<NewInformation, 'id' | 'horodatage'>;

type InformationFormGroupContent = {
  id: FormControl<InformationFormRawValue['id'] | NewInformation['id']>;
  contenu: FormControl<InformationFormRawValue['contenu']>;
  horodatage: FormControl<InformationFormRawValue['horodatage']>;
  utilisateur: FormControl<InformationFormRawValue['utilisateur']>;
  crise: FormControl<InformationFormRawValue['crise']>;
};

export type InformationFormGroup = FormGroup<InformationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InformationFormService {
  createInformationFormGroup(information: InformationFormGroupInput = { id: null }): InformationFormGroup {
    const informationRawValue = this.convertInformationToInformationRawValue({
      ...this.getFormDefaults(),
      ...information,
    });
    return new FormGroup<InformationFormGroupContent>({
      id: new FormControl(
        { value: informationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      contenu: new FormControl(informationRawValue.contenu, {
        validators: [Validators.required],
      }),
      horodatage: new FormControl(informationRawValue.horodatage, {
        validators: [Validators.required],
      }),
      utilisateur: new FormControl(informationRawValue.utilisateur),
      crise: new FormControl(informationRawValue.crise),
    });
  }

  getInformation(form: InformationFormGroup): IInformation | NewInformation {
    return this.convertInformationRawValueToInformation(form.getRawValue() as InformationFormRawValue | NewInformationFormRawValue);
  }

  resetForm(form: InformationFormGroup, information: InformationFormGroupInput): void {
    const informationRawValue = this.convertInformationToInformationRawValue({ ...this.getFormDefaults(), ...information });
    form.reset(
      {
        ...informationRawValue,
        id: { value: informationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InformationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      horodatage: currentTime,
    };
  }

  private convertInformationRawValueToInformation(
    rawInformation: InformationFormRawValue | NewInformationFormRawValue,
  ): IInformation | NewInformation {
    return {
      ...rawInformation,
      horodatage: dayjs(rawInformation.horodatage, DATE_TIME_FORMAT),
    };
  }

  private convertInformationToInformationRawValue(
    information: IInformation | (Partial<NewInformation> & InformationFormDefaults),
  ): InformationFormRawValue | PartialWithRequiredKeyOf<NewInformationFormRawValue> {
    return {
      ...information,
      horodatage: information.horodatage ? information.horodatage.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
