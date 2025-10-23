import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilijalaService } from '../../../services/filijala.service';
import { BankaService } from '../../../services/banka.service';
import { Filijala } from '../../../models/filijala.model';
import { Banka } from '../../../models/banka.model';

@Component({
  selector: 'app-filijala-dialog',
  templateUrl: './filijala-dialog.component.html',
  styleUrls: ['./filijala-dialog.component.css']
})
export class FilijalaDialogComponent implements OnInit {

  filijalaForm: FormGroup;
  isEdit: boolean;
  banke: Banka[] = [];  // ← Lista banaka za dropdown

  constructor(
    private fb: FormBuilder,
    private filijalaService: FilijalaService,
    private bankaService: BankaService,  // ← Injektujemo BankaService
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FilijalaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { filijala: Filijala | null, isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;

    this.filijalaForm = this.fb.group({
      adresa: ['', Validators.required],
      brojPultova: [''],
      posedujeSef: [false],
      bankaId: ['', Validators.required]  // ← Dropdown za izbor banke
    });
  }

  ngOnInit(): void {
    // Učitaj sve banke za dropdown
    this.loadBanke();

    // Ako je edit mode, popuni formu
    if (this.isEdit && this.data.filijala) {
      this.filijalaForm.patchValue({
        adresa: this.data.filijala.adresa,
        brojPultova: this.data.filijala.brojPultova,
        posedujeSef: this.data.filijala.posedujeSef,
        bankaId: this.data.filijala.banka.id  // ← Postavi ID banke
      });
    }
  }

  loadBanke(): void {
    this.bankaService.getAll().subscribe({
      next: (data) => {
        this.banke = data;
      },
      error: (err) => {
        console.error('Greška pri učitavanju banaka:', err);
        this.showMessage('Greška pri učitavanju banaka!');
      }
    });
  }

  onSubmit(): void {
    if (this.filijalaForm.invalid) {
      this.showMessage('Molimo popunite sva obavezna polja!');
      return;
    }

    // Kreiranje objekta koji šaljemo backend-u
    const filijala: any = {
      adresa: this.filijalaForm.value.adresa,
      brojPultova: this.filijalaForm.value.brojPultova,
      posedujeSef: this.filijalaForm.value.posedujeSef,
      banka: {
        id: this.filijalaForm.value.bankaId  // ← Backend očekuje { id: ... }
      }
    };

    if (this.isEdit && this.data.filijala?.id) {
      // UPDATE
      this.filijalaService.update(this.data.filijala.id, filijala).subscribe({
        next: () => {
          this.showMessage('Filijala uspešno ažurirana!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Greška pri ažuriranju:', err);
          this.showMessage('Greška pri ažuriranju filijale!');
        }
      });
    } else {
      // CREATE
      this.filijalaService.create(filijala).subscribe({
        next: () => {
          this.showMessage('Filijala uspešno kreirana!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Greška pri kreiranju:', err);
          this.showMessage('Greška pri kreiranju filijale!');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  showMessage(message: string): void {
    this.snackBar.open(message, 'Zatvori', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}