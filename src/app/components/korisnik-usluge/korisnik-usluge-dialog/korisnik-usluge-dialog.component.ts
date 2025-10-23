import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KorisnikUslugeService } from '../../../services/korisnik-usluge.service';
import { KorisnikUsluge } from '../../../models/korisnik-usluge.model';

@Component({
  selector: 'app-korisnik-usluge-dialog',
  templateUrl: './korisnik-usluge-dialog.component.html',
  styleUrls: ['./korisnik-usluge-dialog.component.css']
})
export class KorisnikUslugeDialogComponent implements OnInit {

  korisnikForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private korisnikService: KorisnikUslugeService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<KorisnikUslugeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { korisnik: KorisnikUsluge | null, isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;

    this.korisnikForm = this.fb.group({
  ime: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  prezime: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  maticniBroj: ['', [
    Validators.required,
    Validators.pattern(/^\d{13}$/),  // Tačno 13 cifara
    Validators.minLength(13),
    Validators.maxLength(13)
  ]]
  });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.korisnik) {
      this.korisnikForm.patchValue({
        ime: this.data.korisnik.ime,
        prezime: this.data.korisnik.prezime,
        maticniBroj: this.data.korisnik.maticniBroj
      });
    }
  }

  onSubmit(): void {
    if (this.korisnikForm.invalid) {
      this.showMessage('Molimo popunite sva obavezna polja!');
      return;
    }

    const korisnik: KorisnikUsluge = this.korisnikForm.value;

    if (this.isEdit && this.data.korisnik?.id) {
      // UPDATE
      this.korisnikService.update(this.data.korisnik.id, korisnik).subscribe({
        next: () => {
          this.showMessage('Korisnik uspešno ažuriran!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Greška pri ažuriranju:', err);
          this.showMessage('Greška pri ažuriranju korisnika!');
        }
      });
    } else {
      // CREATE
      this.korisnikService.create(korisnik).subscribe({
        next: () => {
          this.showMessage('Korisnik uspešno kreiran!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Greška pri kreiranju:', err);
          this.showMessage('Greška pri kreiranju korisnika!');
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