import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IDemande } from '../demande.model';
import { DemandeService } from '../service/demande.service';

@Component({
  templateUrl: './demande-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DemandeDeleteDialogComponent {
  demande?: IDemande;

  protected demandeService = inject(DemandeService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.demandeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
