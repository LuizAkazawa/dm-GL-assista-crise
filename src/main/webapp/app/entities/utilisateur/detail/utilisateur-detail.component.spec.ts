import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { UtilisateurDetailComponent } from './utilisateur-detail.component';

describe('Utilisateur Management Detail Component', () => {
  let comp: UtilisateurDetailComponent;
  let fixture: ComponentFixture<UtilisateurDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./utilisateur-detail.component').then(m => m.UtilisateurDetailComponent),
              resolve: { utilisateur: () => of({ id: 2179 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UtilisateurDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilisateurDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load utilisateur on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UtilisateurDetailComponent);

      // THEN
      expect(instance.utilisateur()).toEqual(expect.objectContaining({ id: 2179 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
