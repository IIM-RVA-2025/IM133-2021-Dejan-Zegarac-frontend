import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BankaService } from '../../../services/banka.service';
import { Banka } from '../../../models/banka.model';

@Component({
  selector: 'app-banka-dialog',
  templateUrl: './banka-dialog.component.html',
  styleUrls: ['./banka-dialog.component.css']
})
export class BankaDialogComponent implements OnInit {

  bankaForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private bankaService: BankaService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<BankaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { banka: Banka | null, isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;

    // Kreiranje forme
    this.bankaForm = this.fb.group({
      naziv: ['', Validators.required],  // Obavezno polje
      kontakt: [''],
      pib: ['']
    });
  }

  ngOnInit(): void {
    // Ako je edit mode, popuni formu
    if (this.isEdit && this.data.banka) {
      this.bankaForm.patchValue({
        naziv: this.data.banka.naziv,
        kontakt: this.data.banka.kontakt,
        pib: this.data.banka.pib
      });
    }
  }

  // ===== SUBMIT =====
  onSubmit(): void {
    if (this.bankaForm.invalid) {
      this.showMessage('Molimo popunite sva obavezna polja!');
      return;
    }

    const banka: Banka = this.bankaForm.value;

    if (this.isEdit && this.data.banka?.id) {
      // UPDATE
      this.bankaService.update(this.data.banka.id, banka).subscribe({
        next: () => {
          this.showMessage('Banka uspešno ažurirana!');
          this.dialogRef.close(true);  // Zatvori dialog sa success
        },
        error: (err) => {
          console.error('Greška pri ažuriranju:', err);
          this.showMessage('Greška pri ažuriranju banke!');
        }
      });
    } else {
      // CREATE
      this.bankaService.create(banka).subscribe({
        next: () => {
          this.showMessage('Banka uspešno kreirana!');
          this.dialogRef.close(true);  // Zatvori dialog sa success
        },
        error: (err) => {
          console.error('Greška pri kreiranju:', err);
          this.showMessage('Greška pri kreiranju banke!');
        }
      });
    }
  }

  // ===== CANCEL =====
  onCancel(): void {
    this.dialogRef.close(false);  // Zatvori bez promene
  }

  // ===== SNACKBAR =====
  showMessage(message: string): void {
    this.snackBar.open(message, 'Zatvori', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}