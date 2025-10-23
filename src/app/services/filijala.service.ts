import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filijala } from '../models/filijala.model';

@Injectable({
  providedIn: 'root'
})
export class FilijalaService {

  private apiUrl = 'http://localhost:8082/filijala';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Filijala[]> {
    return this.http.get<Filijala[]>(this.apiUrl);
  }

  getById(id: number): Observable<Filijala> {
    return this.http.get<Filijala>(`${this.apiUrl}/${id}`);
  }

  create(filijala: Filijala): Observable<Filijala> {
    return this.http.post<Filijala>(this.apiUrl, filijala);
  }

  update(id: number, filijala: Filijala): Observable<Filijala> {
    return this.http.put<Filijala>(`${this.apiUrl}/${id}`, filijala);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchByAdresa(adresa: string): Observable<Filijala[]> {
    return this.http.get<Filijala[]>(`${this.apiUrl}/search?adresa=${adresa}`);
  }

  getByBankaId(bankaId: number): Observable<Filijala[]> {
    return this.http.get<Filijala[]>(`${this.apiUrl}/banka/${bankaId}`);
  }
}