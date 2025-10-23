import { Filijala } from './filijala.model';
import { KorisnikUsluge } from './korisnik-usluge.model';

export interface Usluga {
  id?: number;
  naziv: string;
  opisUsluge?: string;
  datumUgovora: string;  // Format: YYYY-MM-DD (ISO string)
  provizija?: number;
  filijala: Filijala;    // Nested objekat
  korisnik: KorisnikUsluge;  // Nested objekat
}