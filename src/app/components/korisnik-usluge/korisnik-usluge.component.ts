import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KorisnikUslugeService } from '../../services/korisnik-usluge.service';
import { KorisnikUsluge } from '../../models/korisnik-usluge.model';
import { KorisnikUslugeDialogComponent } from './korisnik-usluge-dialog/korisnik-usluge-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-korisnik-usluge',
  templateUrl: './korisnik-usluge.component.html',
  styleUrls: ['./korisnik-usluge.component.css']
})
export class KorisnikUslugeComponent implements OnInit {

  korisnici: KorisnikUsluge[] = [];
  displayedColumns: string[] = ['id', 'ime', 'prezime', 'maticniBroj', 'actions'];
  searchQuery: string = '';
  searchType: string = 'ime'; // 'ime', 'prezime', ili 'jmbg'

  constructor(
    private korisnikService: KorisnikUslugeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadKorisnici();
  }

  loadKorisnici(): void {
    this.korisnikService.getAll().subscribe({
      next: (data) => {
        this.korisnici = data;
        console.log('Korisnici učitani:', data);
      },
      error: (err) => {
        console.error('Greška pri učitavanju korisnika:', err);
        this.showMessage('Greška pri učitavanju korisnika!');
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(KorisnikUslugeDialogComponent, {
      width: '400px',
      data: { korisnik: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadKorisnici();
      }
    });
  }

  openEditDialog(korisnik: KorisnikUsluge): void {
    const dialogRef = this.dialog.open(KorisnikUslugeDialogComponent, {
      width: '400px',
      data: { korisnik: { ...korisnik }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadKorisnici();
      }
    });
  }

  deleteKorisnik(korisnik: KorisnikUsluge): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '400px',
    data: {
      title: 'Potvrda brisanja',
      message: `Da li ste sigurni da želite da obrišete korisnika "${korisnik.ime} ${korisnik.prezime}"?`,
      confirmText: 'Da, obriši',
      cancelText: 'Otkaži'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.korisnikService.delete(korisnik.id!).subscribe({
        next: () => {
          this.showMessage('Korisnik uspešno obrisan!');
          this.loadKorisnici();
        },
        error: (err) => {
          console.error('Greška pri brisanju:', err);
          this.showMessage('Greška pri brisanju korisnika!');
        }
      });
    }
  });
}

  showMessage(message: string): void {
    this.snackBar.open(message, 'Zatvori', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  searchKorisnici(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    if (this.searchType === 'ime') {
      this.korisnikService.searchByIme(this.searchQuery).subscribe({
        next: (data) => this.korisnici = data,
        error: (err) => this.showMessage('Greška pri pretrazi!')
      });
    } else if (this.searchType === 'prezime') {
      this.korisnikService.searchByPrezime(this.searchQuery).subscribe({
        next: (data) => this.korisnici = data,
        error: (err) => this.showMessage('Greška pri pretrazi!')
      });
    } else if (this.searchType === 'jmbg') {
      this.korisnikService.getByMaticniBroj(this.searchQuery).subscribe({
        next: (data) => {
          this.korisnici = data ? [data] : [];
        },
        error: (err) => this.showMessage('Greška pri pretrazi!')
      });
    }
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.loadKorisnici();
  }

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.loadKorisnici(); // Auto-refresh kad je prazno
    }
  }
}