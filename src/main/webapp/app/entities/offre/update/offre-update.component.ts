import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';
import { UtilisateurService } from 'app/entities/utilisateur/service/utilisateur.service';
import { ICrise } from 'app/entities/crise/crise.model';
import { CriseService } from 'app/entities/crise/service/crise.service';
import { OffreService } from '../service/offre.service';
import { IOffre } from '../offre.model';
import { OffreFormGroup, OffreFormService } from './offre-form.service';

@Component({
  selector: 'jhi-offre-update',
  templateUrl: './offre-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OffreUpdateComponent implements OnInit {
  isSaving = false;
  offre: IOffre | null = null;

  utilisateursSharedCollection: IUtilisateur[] = [];
  crisesSharedCollection: ICrise[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected offreService = inject(OffreService);
  protected offreFormService = inject(OffreFormService);
  protected utilisateurService = inject(UtilisateurService);
  protected criseService = inject(CriseService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OffreFormGroup = this.offreFormService.createOffreFormGroup();

  compareUtilisateur = (o1: IUtilisateur | null, o2: IUtilisateur | null): boolean => this.utilisateurService.compareUtilisateur(o1, o2);

  compareCrise = (o1: ICrise | null, o2: ICrise | null): boolean => this.criseService.compareCrise(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ offre }) => {
      this.offre = offre;
      if (offre) {
        this.updateForm(offre);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('ecomApp.error', { ...err, key: `error.file.${err.key}` })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const offre = this.offreFormService.getOffre(this.editForm);
    if (offre.id !== null) {
      this.subscribeToSaveResponse(this.offreService.update(offre));
    } else {
      this.subscribeToSaveResponse(this.offreService.create(offre));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffre>>): void {
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

  protected updateForm(offre: IOffre): void {
    this.offre = offre;
    this.offreFormService.resetForm(this.editForm, offre);

    this.utilisateursSharedCollection = this.utilisateurService.addUtilisateurToCollectionIfMissing<IUtilisateur>(
      this.utilisateursSharedCollection,
      offre.utilisateur,
    );
    this.crisesSharedCollection = this.criseService.addCriseToCollectionIfMissing<ICrise>(this.crisesSharedCollection, offre.crise);
  }

  protected loadRelationshipsOptions(): void {
    this.utilisateurService
      .query()
      .pipe(map((res: HttpResponse<IUtilisateur[]>) => res.body ?? []))
      .pipe(
        map((utilisateurs: IUtilisateur[]) =>
          this.utilisateurService.addUtilisateurToCollectionIfMissing<IUtilisateur>(utilisateurs, this.offre?.utilisateur),
        ),
      )
      .subscribe((utilisateurs: IUtilisateur[]) => (this.utilisateursSharedCollection = utilisateurs));

    this.criseService
      .query()
      .pipe(map((res: HttpResponse<ICrise[]>) => res.body ?? []))
      .pipe(map((crises: ICrise[]) => this.criseService.addCriseToCollectionIfMissing<ICrise>(crises, this.offre?.crise)))
      .subscribe((crises: ICrise[]) => (this.crisesSharedCollection = crises));
  }
}
