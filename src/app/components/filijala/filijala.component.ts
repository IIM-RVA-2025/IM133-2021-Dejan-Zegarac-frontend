import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilijalaService } from '../../services/filijala.service';
import { Filijala } from '../../models/filijala.model';
import { FilijalaDialogComponent } from './filijala-dialog/filijala-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Banka } from '../../models/banka.model';
import { BankaService } from '../../services/banka.service';

@Component({
  selector: 'app-filijala',
  templateUrl: './filijala.component.html',
  styleUrls: ['./filijala.component.css']
})
export class FilijalaComponent implements OnInit {

  filijale: Filijala[] = [];
  displayedColumns: string[] = ['id', 'adresa', 'brojPultova', 'posedujeSef', 'banka', 'actions'];
  searchQuery: string = '';
  searchType: string = 'adresa';
  banke: Banka[] = [];
  
  constructor(
    private filijalaService: FilijalaService,
    private bankaService: BankaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadFilijale();
    this.loadBanke();
  }

  loadFilijale(): void {
    this.filijalaService.getAll().subscribe({
      next: (data) => {
        this.filijale = data;
        console.log('Filijale učitane:', data);
      },
      error: (err) => {
        console.error('Greška pri učitavanju filijala:', err);
        this.showMessage('Greška pri učitavanju filijala!');
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(FilijalaDialogComponent, {
      width: '500px',
      data: { filijala: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFilijale();
      }
    });
  }

  openEditDialog(filijala: Filijala): void {
    const dialogRef = this.dialog.open(FilijalaDialogComponent, {
      width: '500px',
      data: { filijala: { ...filijala }, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFilijale();
      }
    });
  }

  deleteFilijala(filijala: Filijala): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '400px',
    data: {
      title: 'Potvrda brisanja',
      message: `Da li ste sigurni da želite da obrišete filijalu "${filijala.adresa}"?`,
      confirmText: 'Da, obriši',
      cancelText: 'Otkaži'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.filijalaService.delete(filijala.id!).subscribe({
        next: () => {
          this.showMessage('Filijala uspešno obrisana!');
          this.loadFilijale();
        },
        error: (err) => {
          console.error('Greška pri brisanju:', err);
          this.showMessage('Greška pri brisanju filijale!');
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
  searchFilijale(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    if (this.searchType === 'adresa') {
      this.filijalaService.searchByAdresa(this.searchQuery).subscribe({
        next: (data) => this.filijale = data,
        error: (err) => this.showMessage('Greška pri pretrazi!')
      });
    } else if (this.searchType === 'banka') {
      const bankaId = parseInt(this.searchQuery);
      this.filijalaService.getByBankaId(bankaId).subscribe({
        next: (data) => this.filijale = data,
        error: (err) => this.showMessage('Greška pri pretrazi!')
      });
    }
  }

  resetSearch(): void {
    this.searchQuery = '';
    this.loadFilijale();
  }

  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.loadFilijale(); // Auto-refresh kad je prazno
    }
  }

  loadBanke(): void {
    this.bankaService.getAll().subscribe({
      next: (data) => this.banke = data,
      error: (err) => console.error('Greška pri učitavanju banaka')
    });
  }
}