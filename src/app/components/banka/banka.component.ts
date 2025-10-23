import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BankaService } from '../../services/banka.service';
import { Banka } from '../../models/banka.model';
import { BankaDialogComponent } from './banka-dialog/banka-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-banka',
  templateUrl: './banka.component.html',
  styleUrls: ['./banka.component.css']
})
export class BankaComponent implements OnInit {

  banke: Banka[] = [];
  displayedColumns: string[] = ['id', 'naziv', 'kontakt', 'pib', 'actions'];

  constructor(
    private bankaService: BankaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadBanke();
  }

  loadBanke(): void {
    this.bankaService.getAll().subscribe({
      next: (data) => {
        this.banke = data;
        console.log('Banke učitane:', data);
      },
      error: (err) => {
        console.error('Greška pri učitavanju banaka:', err);
        this.showMessage('Greška pri učitavanju banaka!');
      }
    });
  }

  // ===== OTVORI DIALOG ZA DODAVANJE =====
  openAddDialog(): void {
    const dialogRef = this.dialog.open(BankaDialogComponent, {
      width: '400px',
      data: { banka: null, isEdit: false }  // null = nova banka
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBanke();  // Refresh tabele
      }
    });
  }

  // ===== OTVORI DIALOG ZA EDITOVANJE =====
  openEditDialog(banka: Banka): void {
    const dialogRef = this.dialog.open(BankaDialogComponent, {
      width: '400px',
      data: { banka: { ...banka }, isEdit: true }  // Copy objekta
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBanke();  // Refresh tabele
      }
    });
  }

  // ===== DELETE =====
deleteBanka(banka: Banka): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '400px',
    data: {
      title: 'Potvrda brisanja',
      message: `Da li ste sigurni da želite da obrišete banku "${banka.naziv}"?`,
      confirmText: 'Da, obriši',
      cancelText: 'Otkaži'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {  // Ako je korisnik potvrdio
      this.bankaService.delete(banka.id!).subscribe({
        next: () => {
          this.showMessage('Banka uspešno obrisana!');
          this.loadBanke();
        },
        error: (err) => {
          console.error('Greška pri brisanju:', err);
          this.showMessage('Greška pri brisanju banke!');
        }
      });
    }
  });
}

  // ===== SNACKBAR NOTIFIKACIJA =====
  showMessage(message: string): void {
    this.snackBar.open(message, 'Zatvori', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}