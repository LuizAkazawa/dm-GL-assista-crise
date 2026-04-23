import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IDemande, NewDemande } from '../demande.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDemande for edit and NewDemandeFormGroupInput for create.
 */
type DemandeFormGroupInput = IDemande | PartialWithRequiredKeyOf<NewDemande>;

type DemandeFormDefaults = Pick<NewDemande, 'id' | 'isArchived'>;

type DemandeFormGroupContent = {
  id: FormControl<IDemande['id'] | NewDemande['id']>;
  description: FormControl<IDemande['description']>;
  typeBesoin: FormControl<IDemande['typeBesoin']>;
  geolocalisation: FormControl<IDemande['geolocalisation']>;
  statut: FormControl<IDemande['statut']>;
  isArchived: FormControl<IDemande['isArchived']>;
  utilisateur: FormControl<IDemande['utilisateur']>;
  crise: FormControl<IDemande['crise']>;
};

export type DemandeFormGroup = FormGroup<DemandeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DemandeFormService {
  createDemandeFormGroup(demande: DemandeFormGroupInput = { id: null }): DemandeFormGroup {
    const demandeRawValue = {
      ...this.getFormDefaults(),
      ...demande,
    };
    return new FormGroup<DemandeFormGroupContent>({
      id: new FormControl(
        { value: demandeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      description: new FormControl(demandeRawValue.description, {
        validators: [Validators.required],
      }),
      typeBesoin: new FormControl(demandeRawValue.typeBesoin, {
        validators: [Validators.required],
      }),
      geolocalisation: new FormControl(demandeRawValue.geolocalisation, {
        validators: [Validators.required],
      }),
      statut: new FormControl(demandeRawValue.statut, {
        validators: [Validators.required],
      }),
      isArchived: new FormControl(demandeRawValue.isArchived),
      utilisateur: new FormControl(demandeRawValue.utilisateur),
      crise: new FormControl(demandeRawValue.crise),
    });
  }

  getDemande(form: DemandeFormGroup): IDemande | NewDemande {
    return form.getRawValue() as IDemande | NewDemande;
  }

  resetForm(form: DemandeFormGroup, demande: DemandeFormGroupInput): void {
    const demandeRawValue = { ...this.getFormDefaults(), ...demande };
    form.reset(
      {
        ...demandeRawValue,
        id: { value: demandeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DemandeFormDefaults {
    return {
      id: null,
      isArchived: false,
    };
  }
}
