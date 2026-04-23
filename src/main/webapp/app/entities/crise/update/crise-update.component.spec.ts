import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';
import { UtilisateurService } from 'app/entities/utilisateur/service/utilisateur.service';
import { CriseService } from '../service/crise.service';
import { ICrise } from '../crise.model';
import { CriseFormService } from './crise-form.service';

import { CriseUpdateComponent } from './crise-update.component';

describe('Crise Management Update Component', () => {
  let comp: CriseUpdateComponent;
  let fixture: ComponentFixture<CriseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let criseFormService: CriseFormService;
  let criseService: CriseService;
  let utilisateurService: UtilisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CriseUpdateComponent],
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
      .overrideTemplate(CriseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CriseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    criseFormService = TestBed.inject(CriseFormService);
    criseService = TestBed.inject(CriseService);
    utilisateurService = TestBed.inject(UtilisateurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Utilisateur query and add missing value', () => {
      const crise: ICrise = { id: 22123 };
      const sinistres: IUtilisateur[] = [{ id: 2179 }];
      crise.sinistres = sinistres;

      const utilisateurCollection: IUtilisateur[] = [{ id: 2179 }];
      jest.spyOn(utilisateurService, 'query').mockReturnValue(of(new HttpResponse({ body: utilisateurCollection })));
      const additionalUtilisateurs = [...sinistres];
      const expectedCollection: IUtilisateur[] = [...additionalUtilisateurs, ...utilisateurCollection];
      jest.spyOn(utilisateurService, 'addUtilisateurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ crise });
      comp.ngOnInit();

      expect(utilisateurService.query).toHaveBeenCalled();
      expect(utilisateurService.addUtilisateurToCollectionIfMissing).toHaveBeenCalledWith(
        utilisateurCollection,
        ...additionalUtilisateurs.map(expect.objectContaining),
      );
      expect(comp.utilisateursSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const crise: ICrise = { id: 22123 };
      const sinistre: IUtilisateur = { id: 2179 };
      crise.sinistres = [sinistre];

      activatedRoute.data = of({ crise });
      comp.ngOnInit();

      expect(comp.utilisateursSharedCollection).toContainEqual(sinistre);
      expect(comp.crise).toEqual(crise);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICrise>>();
      const crise = { id: 11332 };
      jest.spyOn(criseFormService, 'getCrise').mockReturnValue(crise);
      jest.spyOn(criseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ crise });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: crise }));
      saveSubject.complete();

      // THEN
      expect(criseFormService.getCrise).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(criseService.update).toHaveBeenCalledWith(expect.objectContaining(crise));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICrise>>();
      const crise = { id: 11332 };
      jest.spyOn(criseFormService, 'getCrise').mockReturnValue({ id: null });
      jest.spyOn(criseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ crise: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: crise }));
      saveSubject.complete();

      // THEN
      expect(criseFormService.getCrise).toHaveBeenCalled();
      expect(criseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICrise>>();
      const crise = { id: 11332 };
      jest.spyOn(criseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ crise });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(criseService.update).toHaveBeenCalled();
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
  });
});
