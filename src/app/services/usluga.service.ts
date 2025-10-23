import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usluga } from '../models/usluga.model';

@Injectable({
  providedIn: 'root'
})
export class UslugaService {

  private apiUrl = 'http://localhost:8082/usluga';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Usluga[]> {
    return this.http.get<Usluga[]>(this.apiUrl);
  }

  getById(id: number): Observable<Usluga> {
    return this.http.get<Usluga>(`${this.apiUrl}/${id}`);
  }

  create(usluga: Usluga): Observable<Usluga> {
    return this.http.post<Usluga>(this.apiUrl, usluga);
  }

  update(id: number, usluga: Usluga): Observable<Usluga> {
    return this.http.put<Usluga>(`${this.apiUrl}/${id}`, usluga);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchByNaziv(naziv: string): Observable<Usluga[]> {
    return this.http.get<Usluga[]>(`${this.apiUrl}/search?naziv=${naziv}`);
  }

  getByFilijalaId(filijalaId: number): Observable<Usluga[]> {
    return this.http.get<Usluga[]>(`${this.apiUrl}/filijala/${filijalaId}`);
  }

  getByKorisnikId(korisnikId: number): Observable<Usluga[]> {
    return this.http.get<Usluga[]>(`${this.apiUrl}/korisnik/${korisnikId}`);
  }

  getByBankaId(bankaId: number): Observable<Usluga[]> {
    return this.http.get<Usluga[]>(`${this.apiUrl}/banka/${bankaId}`);
  }

  getAfterDate(datum: string): Observable<Usluga[]> {
    return this.http.get<Usluga[]>(`${this.apiUrl}/after?datum=${datum}`);
  }

  getBetweenDates(from: string, to: string): Observable<Usluga[]> {
    return this.http.get<Usluga[]>(`${this.apiUrl}/between?from=${from}&to=${to}`);
  }
}