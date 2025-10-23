import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KorisnikUsluge } from '../models/korisnik-usluge.model';

@Injectable({
  providedIn: 'root'
})
export class KorisnikUslugeService {

  private apiUrl = 'http://localhost:8082/korisnik';

  constructor(private http: HttpClient) { }

  getAll(): Observable<KorisnikUsluge[]> {
    return this.http.get<KorisnikUsluge[]>(this.apiUrl);
  }

  getById(id: number): Observable<KorisnikUsluge> {
    return this.http.get<KorisnikUsluge>(`${this.apiUrl}/${id}`);
  }

  create(korisnik: KorisnikUsluge): Observable<KorisnikUsluge> {
    return this.http.post<KorisnikUsluge>(this.apiUrl, korisnik);
  }

  update(id: number, korisnik: KorisnikUsluge): Observable<KorisnikUsluge> {
    return this.http.put<KorisnikUsluge>(`${this.apiUrl}/${id}`, korisnik);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchByIme(ime: string): Observable<KorisnikUsluge[]> {
    return this.http.get<KorisnikUsluge[]>(`${this.apiUrl}/search/ime?ime=${ime}`);
  } 

  searchByPrezime(prezime: string): Observable<KorisnikUsluge[]> {
    return this.http.get<KorisnikUsluge[]>(`${this.apiUrl}/search/prezime?prezime=${prezime}`);
  }

  getByMaticniBroj(maticniBroj: string): Observable<KorisnikUsluge> {
    return this.http.get<KorisnikUsluge>(`${this.apiUrl}/maticni/${maticniBroj}`);
  }
}