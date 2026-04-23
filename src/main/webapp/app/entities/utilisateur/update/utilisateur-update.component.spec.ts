import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ICrise } from 'app/entities/crise/crise.model';
import { CriseService } from 'app/entities/crise/service/crise.service';
import { UtilisateurService } from '../service/utilisateur.service';
import { IUtilisateur } from '../utilisateur.model';
import { UtilisateurFormService } from './utilisateur-form.service';

import { UtilisateurUpdateComponent } from './utilisateur-update.component';

describe('Utilisateur Management Update Component', () => {
  let comp: UtilisateurUpdateComponent;
  let fixture: ComponentFixture<UtilisateurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let utilisateurFormService: UtilisateurFormService;
  let utilisateurService: UtilisateurService;
  let criseService: CriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UtilisateurUpdateComponent],
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
      .overrideTemplate(UtilisateurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UtilisateurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    utilisateurFormService = TestBed.inject(UtilisateurFormService);
    utilisateurService = TestBed.inject(UtilisateurService);
    criseService = TestBed.inject(CriseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Crise query and add missing value', () => {
      const utilisateur: IUtilisateur = { id: 31928 };
      const criseTouchees: ICrise[] = [{ id: 11332 }];
      utilisateur.criseTouchees = criseTouchees;

      const criseCollection: ICrise[] = [{ id: 11332 }];
      jest.spyOn(criseService, 'query').mockReturnValue(of(new HttpResponse({ body: criseCollection })));
      const additionalCrises = [...criseTouchees];
      const expectedCollection: ICrise[] = [...additionalCrises, ...criseCollection];
      jest.spyOn(criseService, 'addCriseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ utilisateur });
      comp.ngOnInit();

      expect(criseService.query).toHaveBeenCalled();
      expect(criseService.addCriseToCollectionIfMissing).toHaveBeenCalledWith(
        criseCollection,
        ...additionalCrises.map(expect.objectContaining),
      );
      expect(comp.crisesSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const utilisateur: IUtilisateur = { id: 31928 };
      const criseTouchee: ICrise = { id: 11332 };
      utilisateur.criseTouchees = [criseTouchee];

      activatedRoute.data = of({ utilisateur });
      comp.ngOnInit();

      expect(comp.crisesSharedCollection).toContainEqual(criseTouchee);
      expect(comp.utilisateur).toEqual(utilisateur);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUtilisateur>>();
      const utilisateur = { id: 2179 };
      jest.spyOn(utilisateurFormService, 'getUtilisateur').mockReturnValue(utilisateur);
      jest.spyOn(utilisateurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ utilisateur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: utilisateur }));
      saveSubject.complete();

      // THEN
      expect(utilisateurFormService.getUtilisateur).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(utilisateurService.update).toHaveBeenCalledWith(expect.objectContaining(utilisateur));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUtilisateur>>();
      const utilisateur = { id: 2179 };
      jest.spyOn(utilisateurFormService, 'getUtilisateur').mockReturnValue({ id: null });
      jest.spyOn(utilisateurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ utilisateur: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: utilisateur }));
      saveSubject.complete();

      // THEN
      expect(utilisateurFormService.getUtilisateur).toHaveBeenCalled();
      expect(utilisateurService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUtilisateur>>();
      const utilisateur = { id: 2179 };
      jest.spyOn(utilisateurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ utilisateur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(utilisateurService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
