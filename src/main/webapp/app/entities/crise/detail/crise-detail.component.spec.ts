import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { CriseDetailComponent } from './crise-detail.component';

describe('Crise Management Detail Component', () => {
  let comp: CriseDetailComponent;
  let fixture: ComponentFixture<CriseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriseDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./crise-detail.component').then(m => m.CriseDetailComponent),
              resolve: { crise: () => of({ id: 11332 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CriseDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load crise on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CriseDetailComponent);

      // THEN
      expect(instance.crise()).toEqual(expect.objectContaining({ id: 11332 }));
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
