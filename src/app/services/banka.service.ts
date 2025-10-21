import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Banka } from "../models/banka.model";

@Injectable({
    providedIn: 'root'
})
export class BankaService {
    private apiUrl = 'http://localhost:8082/banka';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Banka[]> {
        return this.http.get<Banka[]>(this.apiUrl);
    }

    getById(id: number): Observable<Banka> {
        return this.http.get<Banka>(`${this.apiUrl}/${id}`);
    }

    create(banka: Banka): Observable<Banka> {
        return this.http.post<Banka>(this.apiUrl, banka);
    }

    update(id: number, banka: Banka): Observable<Banka> {
        return this.http.put<Banka>(`${this.apiUrl}/${id}`, banka);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}