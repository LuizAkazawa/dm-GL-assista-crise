import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IOffre, NewOffre } from '../offre.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOffre for edit and NewOffreFormGroupInput for create.
 */
type OffreFormGroupInput = IOffre | PartialWithRequiredKeyOf<NewOffre>;

type OffreFormDefaults = Pick<NewOffre, 'id' | 'isArchived'>;

type OffreFormGroupContent = {
  id: FormControl<IOffre['id'] | NewOffre['id']>;
  description: FormControl<IOffre['description']>;
  geolocalisation: FormControl<IOffre['geolocalisation']>;
  isArchived: FormControl<IOffre['isArchived']>;
  utilisateur: FormControl<IOffre['utilisateur']>;
  crise: FormControl<IOffre['crise']>;
};

export type OffreFormGroup = FormGroup<OffreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OffreFormService {
  createOffreFormGroup(offre: OffreFormGroupInput = { id: null }): OffreFormGroup {
    const offreRawValue = {
      ...this.getFormDefaults(),
      ...offre,
    };
    return new FormGroup<OffreFormGroupContent>({
      id: new FormControl(
        { value: offreRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      description: new FormControl(offreRawValue.description, {
        validators: [Validators.required],
      }),
      geolocalisation: new FormControl(offreRawValue.geolocalisation, {
        validators: [Validators.required],
      }),
      isArchived: new FormControl(offreRawValue.isArchived),
      utilisateur: new FormControl(offreRawValue.utilisateur),
      crise: new FormControl(offreRawValue.crise),
    });
  }

  getOffre(form: OffreFormGroup): IOffre | NewOffre {
    return form.getRawValue() as IOffre | NewOffre;
  }

  resetForm(form: OffreFormGroup, offre: OffreFormGroupInput): void {
    const offreRawValue = { ...this.getFormDefaults(), ...offre };
    form.reset(
      {
        ...offreRawValue,
        id: { value: offreRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OffreFormDefaults {
    return {
      id: null,
      isArchived: false,
    };
  }
}
