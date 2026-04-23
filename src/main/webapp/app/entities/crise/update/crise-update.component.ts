import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';
import { UtilisateurService } from 'app/entities/utilisateur/service/utilisateur.service';
import { TypeCrise } from 'app/entities/enumerations/type-crise.model';
import { CriseService } from '../service/crise.service';
import { ICrise } from '../crise.model';
import { CriseFormGroup, CriseFormService } from './crise-form.service';

@Component({
  selector: 'jhi-crise-update',
  templateUrl: './crise-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CriseUpdateComponent implements OnInit {
  isSaving = false;
  crise: ICrise | null = null;
  typeCriseValues = Object.keys(TypeCrise);

  utilisateursSharedCollection: IUtilisateur[] = [];

  protected criseService = inject(CriseService);
  protected criseFormService = inject(CriseFormService);
  protected utilisateurService = inject(UtilisateurService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CriseFormGroup = this.criseFormService.createCriseFormGroup();

  compareUtilisateur = (o1: IUtilisateur | null, o2: IUtilisateur | null): boolean => this.utilisateurService.compareUtilisateur(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ crise }) => {
      this.crise = crise;
      if (crise) {
        this.updateForm(crise);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const crise = this.criseFormService.getCrise(this.editForm);
    if (crise.id !== null) {
      this.subscribeToSaveResponse(this.criseService.update(crise));
    } else {
      this.subscribeToSaveResponse(this.criseService.create(crise));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICrise>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(crise: ICrise): void {
    this.crise = crise;
    this.criseFormService.resetForm(this.editForm, crise);

    this.utilisateursSharedCollection = this.utilisateurService.addUtilisateurToCollectionIfMissing<IUtilisateur>(
      this.utilisateursSharedCollection,
      ...(crise.sinistres ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.utilisateurService
      .query()
      .pipe(map((res: HttpResponse<IUtilisateur[]>) => res.body ?? []))
      .pipe(
        map((utilisateurs: IUtilisateur[]) =>
          this.utilisateurService.addUtilisateurToCollectionIfMissing<IUtilisateur>(utilisateurs, ...(this.crise?.sinistres ?? [])),
        ),
      )
      .subscribe((utilisateurs: IUtilisateur[]) => (this.utilisateursSharedCollection = utilisateurs));
  }
}
