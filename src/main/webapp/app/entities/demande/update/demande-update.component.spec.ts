import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';
import { UtilisateurService } from 'app/entities/utilisateur/service/utilisateur.service';
import { ICrise } from 'app/entities/crise/crise.model';
import { CriseService } from 'app/entities/crise/service/crise.service';
import { IDemande } from '../demande.model';
import { DemandeService } from '../service/demande.service';
import { DemandeFormService } from './demande-form.service';

import { DemandeUpdateComponent } from './demande-update.component';

describe('Demande Management Update Component', () => {
  let comp: DemandeUpdateComponent;
  let fixture: ComponentFixture<DemandeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let demandeFormService: DemandeFormService;
  let demandeService: DemandeService;
  let utilisateurService: UtilisateurService;
  let criseService: CriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemandeUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DemandeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DemandeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    demandeFormService = TestBed.inject(DemandeFormService);
    demandeService = TestBed.inject(DemandeService);
    utilisateurService = TestBed.inject(UtilisateurService);
    criseService = TestBed.inject(CriseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Utilisateur query and add missing value', () => {
      const demande: IDemande = { id: 24127 };
      const utilisateur: IUtilisateur = { id: 2179 };
      demande.utilisateur = utilisateur;

      const utilisateurCollection: IUtilisateur[] = [{ id: 2179 }];
      jest.spyOn(utilisateurService, 'query').mockReturnValue(of(new HttpResponse({ body: utilisateurCollection })));
      const additionalUtilisateurs = [utilisateur];
      const expectedCollection: IUtilisateur[] = [...additionalUtilisateurs, ...utilisateurCollection];
      jest.spyOn(utilisateurService, 'addUtilisateurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ demande });
      comp.ngOnInit();

      expect(utilisateurService.query).toHaveBeenCalled();
      expect(utilisateurService.addUtilisateurToCollectionIfMissing).toHaveBeenCalledWith(
        utilisateurCollection,
        ...additionalUtilisateurs.map(expect.objectContaining),
      );
      expect(comp.utilisateursSharedCollection).toEqual(expectedCollection);
    });

    it('should call Crise query and add missing value', () => {
      const demande: IDemande = { id: 24127 };
      const crise: ICrise = { id: 11332 };
      demande.crise = crise;

      const criseCollection: ICrise[] = [{ id: 11332 }];
      jest.spyOn(criseService, 'query').mockReturnValue(of(new HttpResponse({ body: criseCollection })));
      const additionalCrises = [crise];
      const expectedCollection: ICrise[] = [...additionalCrises, ...criseCollection];
      jest.spyOn(criseService, 'addCriseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ demande });
      comp.ngOnInit();

      expect(criseService.query).toHaveBeenCalled();
      expect(criseService.addCriseToCollectionIfMissing).toHaveBeenCalledWith(
        criseCollection,
        ...additionalCrises.map(expect.objectContaining),
      );
      expect(comp.crisesSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const demande: IDemande = { id: 24127 };
      const utilisateur: IUtilisateur = { id: 2179 };
      demande.utilisateur = utilisateur;
      const crise: ICrise = { id: 11332 };
      demande.crise = crise;

      activatedRoute.data = of({ demande });
      comp.ngOnInit();

      expect(comp.utilisateursSharedCollection).toContainEqual(utilisateur);
      expect(comp.crisesSharedCollection).toContainEqual(crise);
      expect(comp.demande).toEqual(demande);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemande>>();
      const demande = { id: 27574 };
      jest.spyOn(demandeFormService, 'getDemande').mockReturnValue(demande);
      jest.spyOn(demandeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: demande }));
      saveSubject.complete();

      // THEN
      expect(demandeFormService.getDemande).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(demandeService.update).toHaveBeenCalledWith(expect.objectContaining(demande));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemande>>();
      const demande = { id: 27574 };
      jest.spyOn(demandeFormService, 'getDemande').mockReturnValue({ id: null });
      jest.spyOn(demandeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demande: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: demande }));
      saveSubject.complete();

      // THEN
      expect(demandeFormService.getDemande).toHaveBeenCalled();
      expect(demandeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDemande>>();
      const demande = { id: 27574 };
      jest.spyOn(demandeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ demande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(demandeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUtilisateur', () => {
      it('should forward to utilisateurService', () => {
        const entity = { id: 2179 };
        const entity2 = { id: 31928 };
        jest.spyOn(utilisateurService, 'compareUtilisateur');
        comp.compareUtilisateur(entity, entity2);
        expect(utilisateurService.compareUtilisateur).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCrise', () => {
      it('should forward to criseService', () => {
        const entity = { id: 11332 };
        const entity2 = { id: 22123 };
        jest.spyOn(criseService, 'compareCrise');
        comp.compareCrise(entity, entity2);
        expect(criseService.compareCrise).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
