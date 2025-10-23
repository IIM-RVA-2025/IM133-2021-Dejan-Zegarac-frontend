import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors  } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UslugaService } from '../../../services/usluga.service';
import { FilijalaService } from '../../../services/filijala.service';
import { KorisnikUslugeService } from '../../../services/korisnik-usluge.service';
import { Usluga } from '../../../models/usluga.model';
import { Filijala } from '../../../models/filijala.model';
import { KorisnikUsluge } from '../../../models/korisnik-usluge.model';

function notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;  // Ako nema vrednosti, neka required validator hendluje
  }
  
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Reset vremena na ponoć
  
  if (selectedDate > today) {
    return { futureDate: true };  // Greška ako je datum u budućnosti
  }
  
  return null;  // Validno
}

@Component({
  selector: 'app-usluga-dialog',
  templateUrl: './usluga-dialog.component.html',
  styleUrls: ['./usluga-dialog.component.css']
})
export class UslugaDialogComponent implements OnInit {

  uslugaForm: FormGroup;
  isEdit: boolean;
  filijale: Filijala[] = [];      // ← Lista filijala za dropdown
  korisnici: KorisnikUsluge[] = [];  // ← Lista korisnika za dropdown

  constructor(
    private fb: FormBuilder,
    private uslugaService: UslugaService,
    private filijalaService: FilijalaService,
    private korisnikService: KorisnikUslugeService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UslugaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usluga: Usluga | null, isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;

    this.uslugaForm = this.fb.group({
      naziv: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      opisUsluge: ['', [Validators.maxLength(500)]],
      datumUgovora: ['', [Validators.required, notFutureDateValidator]],
      provizija: ['', [Validators.min(0), Validators.max(9999999999)]],
      filijalaId: ['', Validators.required],    // ← Dropdown 1
      korisnikId: ['', Validators.required]     // ← Dropdown 2
    });
  }

  ngOnInit(): void {
    // Učitaj filijale i korisnike za dropdowne
    this.loadFilijale();
    this.loadKorisnici();

    // Ako je edit mode, popuni formu
    if (this.isEdit && this.data.usluga) {
      this.uslugaForm.patchValue({
        naziv: this.data.usluga.naziv,
        opisUsluge: this.data.usluga.opisUsluge,
        datumUgovora: new Date(this.data.usluga.datumUgovora),  // ← Konvertuj string u Date
        provizija: this.data.usluga.provizija,
        filijalaId: this.data.usluga.filijala.id,
        korisnikId: this.data.usluga.korisnik.id
      });
    }
  }

  loadFilijale(): void {
    this.filijalaService.getAll().subscribe({
      next: (data) => {
        this.filijale = data;
      },
      error: (err) => {
        console.error('Greška pri učitavanju filijala:', err);
        this.showMessage('Greška pri učitavanju filijala!');
      }
    });
  }

  loadKorisnici(): void {
    this.korisnikService.getAll().subscribe({
      next: (data) => {
        this.korisnici = data;
      },
      error: (err) => {
        console.error('Greška pri učitavanju korisnika:', err);
        this.showMessage('Greška pri učitavanju korisnika!');
      }
    });
  }

  onSubmit(): void {
    if (this.uslugaForm.invalid) {
      this.showMessage('Molimo popunite sva obavezna polja!');
      return;
    }

    // Konvertuj Date u ISO string (YYYY-MM-DD)
    const formValue = this.uslugaForm.value;
    const datum = formValue.datumUgovora instanceof Date 
      ? formValue.datumUgovora.toISOString().split('T')[0]  // ← Date → "2024-01-15"
      : formValue.datumUgovora;

    // Kreiranje objekta za backend
    const usluga: any = {
      naziv: formValue.naziv,
      opisUsluge: formValue.opisUsluge,
      datumUgovora: datum,
      provizija: formValue.provizija,
      filijala: {
        id: formValue.filijalaId
      },
      korisnik: {
        id: formValue.korisnikId
      }
    };

    if (this.isEdit && this.data.usluga?.id) {
      // UPDATE
      this.uslugaService.update(this.data.usluga.id, usluga).subscribe({
        next: () => {
          this.showMessage('Usluga uspešno ažurirana!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Greška pri ažuriranju:', err);
          this.showMessage('Greška pri ažuriranju usluge!');
        }
      });
    } else {
      // CREATE
      this.uslugaService.create(usluga).subscribe({
        next: () => {
          this.showMessage('Usluga uspešno kreirana!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Greška pri kreiranju:', err);
          this.showMessage('Greška pri kreiranju usluge!');
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