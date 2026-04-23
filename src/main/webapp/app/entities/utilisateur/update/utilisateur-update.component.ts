import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICrise } from 'app/entities/crise/crise.model';
import { CriseService } from 'app/entities/crise/service/crise.service';
import { IUtilisateur } from '../utilisateur.model';
import { UtilisateurService } from '../service/utilisateur.service';
import { UtilisateurFormGroup, UtilisateurFormService } from './utilisateur-form.service';

@Component({
  selector: 'jhi-utilisateur-update',
  templateUrl: './utilisateur-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UtilisateurUpdateComponent implements OnInit {
  isSaving = false;
  utilisateur: IUtilisateur | null = null;

  crisesSharedCollection: ICrise[] = [];

  protected utilisateurService = inject(UtilisateurService);
  protected utilisateurFormService = inject(UtilisateurFormService);
  protected criseService = inject(CriseService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UtilisateurFormGroup = this.utilisateurFormService.createUtilisateurFormGroup();

  compareCrise = (o1: ICrise | null, o2: ICrise | null): boolean => this.criseService.compareCrise(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ utilisateur }) => {
      this.utilisateur = utilisateur;
      if (utilisateur) {
        this.updateForm(utilisateur);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const utilisateur = this.utilisateurFormService.getUtilisateur(this.editForm);
    if (utilisateur.id !== null) {
      this.subscribeToSaveResponse(this.utilisateurService.update(utilisateur));
    } else {
      this.subscribeToSaveResponse(this.utilisateurService.create(utilisateur));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUtilisateur>>): void {
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

  protected updateForm(utilisateur: IUtilisateur): void {
    this.utilisateur = utilisateur;
    this.utilisateurFormService.resetForm(this.editForm, utilisateur);

    this.crisesSharedCollection = this.criseService.addCriseToCollectionIfMissing<ICrise>(
      this.crisesSharedCollection,
      ...(utilisateur.criseTouchees ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.criseService
      .query()
      .pipe(map((res: HttpResponse<ICrise[]>) => res.body ?? []))
      .pipe(
        map((crises: ICrise[]) =>
          this.criseService.addCriseToCollectionIfMissing<ICrise>(crises, ...(this.utilisateur?.criseTouchees ?? [])),
        ),
      )
      .subscribe((crises: ICrise[]) => (this.crisesSharedCollection = crises));
  }
}
