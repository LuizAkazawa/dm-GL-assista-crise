import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { ICrise } from '../crise.model';

@Component({
  selector: 'jhi-crise-detail',
  templateUrl: './crise-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class CriseDetailComponent {
  crise = input<ICrise | null>(null);

  previousState(): void {
    window.history.back();
  }
}
