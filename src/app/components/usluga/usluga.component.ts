import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UslugaService } from '../../services/usluga.service';
import { Usluga } from '../../models/usluga.model';
import { UslugaDialogComponent } from './usluga-dialog/usluga-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Filijala } from '../../models/filijala.model';
import { KorisnikUsluge } from '../../models/korisnik-usluge.model';
import { Banka } from '../../models/banka.model';
import { FilijalaService } from '../../services/filijala.service';
import { KorisnikUslugeService } from '../../services/korisnik-usluge.service';
import { BankaService } from '../../services/banka.service';

@Component({
  selector: 'app-usluga',
  templateUrl: './usluga.component.html',
  styleUrls: ['./usluga.component.css']
})
export class UslugaComponent implements OnInit {

  usluge: Usluga[] = [];
  displayedColumns: string[] = ['id', 'naziv', 'datumUgovora', 'provizija', 'filijala', 'korisnik', 'actions'];
  searchQuery: string = '';
  searchType: string = 'naziv';
  filijale: Filijala[] = [];
  korisnici: KorisnikUsluge[] = [];
  banke: Banka[] = [];
  datumOd: Date | null = null;
  datumDo: Date | null = null;

  constructor(
    private uslugaService: UslugaService,
    private filijalaService: FilijalaService,
    private korisnikService: KorisnikUslugeService,
    private bankaService: BankaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsluge();
    this.loadFilijale();
    this.loadKorisnici();
    this.loadBanke();
  }

  loadUsluge(): void {
    this.uslugaService.getAll().subscribe({
      next: (data) => {
        this.usluge = data;
        console.log('Usluge učitane:', data);
      },
      error: (err) => {
        console.error('Greška pri učitavanju usluga:', err);
        this.showMessage('Greška pri učitavanju usluga!');
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(UslugaDialogComponent, {
      width: '600px',
      data: { usluga: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsluge();
      }
    });
  }

  openEditDialog(usluga: Usluga): void {
    const dialogRef = this.dialog.open(UslugaDialogComponent, {
      width: '600px',
      data: { usluga: { ...usluga }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsluge();
      }
    });
  }

  deleteUsluga(usluga: Usluga): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '400px',
    data: {
      title: 'Potvrda brisanja',
      message: `Da li ste sigurni da želite da obrišete uslugu "${usluga.naziv}"?`,
      confirmText: 'Da, obriši',
      cancelText: 'Otkaži'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.uslugaService.delete(usluga.id!).subscribe({
        next: () => {
          this.showMessage('Usluga uspešno obrisana!');
          this.loadUsluge();
        },
        error: (err) => {
          console.error('Greška pri brisanju:', err);
          this.showMessage('Greška pri brisanju usluge!');
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

  searchUsluge(): void {
    if (this.searchType === 'naziv' && !this.searchQuery.trim()) {
      return;
    }

    switch (this.searchType) {
      case 'naziv':
        this.uslugaService.searchByNaziv(this.searchQuery).subscribe({
          next: (data) => this.usluge = data,
          error: (err) => this.showMessage('Greška!')
        });
        break;

      case 'filijala':
        const filijalaId = parseInt(this.searchQuery);
        this.uslugaService.getByFilijalaId(filijalaId).subscribe({
          next: (data) => this.usluge = data,
          error: (err) => this.showMessage('Greška!')
        });
        break;

      case 'korisnik':
        const korisnikId = parseInt(this.searchQuery);
        this.uslugaService.getByKorisnikId(korisnikId).subscribe({
          next: (data) => this.usluge = data,
          error: (err) => this.showMessage('Greška!')
        });
        break;

      case 'banka':
        const bankaId = parseInt(this.searchQuery);
        this.uslugaService.getByBankaId(bankaId).subscribe({
          next: (data) => this.usluge = data,
          error: (err) => this.showMessage('Greška!')
        });
        break;

      case 'posle':
        if (this.datumOd) {
          const datum = this.formatDate(this.datumOd);
          this.uslugaService.getAfterDate(datum).subscribe({
            next: (data) => this.usluge = data,
            error: (err) => this.showMessage('Greška!')
          });
        }
        break;

      case 'period':
        if (this.datumOd && this.datumDo) {
          const from = this.formatDate(this.datumOd);
          const to = this.formatDate(this.datumDo);
          this.uslugaService.getBetweenDates(from, to).subscribe({
            next: (data) => this.usluge = data,
            error: (err) => this.showMessage('Greška!')
          });
        }
        break;
    }
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.datumOd = null;
    this.datumDo = null;
    this.loadUsluge();
  }

  onSearchChange(): void {
    if (!this.searchQuery.trim() && this.searchType === 'naziv') {
      this.loadUsluge();
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadFilijale(): void {
    this.filijalaService.getAll().subscribe({
      next: (data) => this.filijale = data,
      error: (err) => console.error('Greška')
    });
  }

  loadKorisnici(): void {
    this.korisnikService.getAll().subscribe({
      next: (data) => this.korisnici = data,
      error: (err) => console.error('Greška')
    });
  }

  loadBanke(): void {
    this.bankaService.getAll().subscribe({
      next: (data) => this.banke = data,
      error: (err) => console.error('Greška')
    });
  }
}