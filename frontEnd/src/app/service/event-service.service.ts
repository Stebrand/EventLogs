import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventServiceService {
  private apiUrl = 'http://127.0.0.1:5000'
  constructor(private http: HttpClient) { }

  registerEvent(event: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, event);
  }

  queryEvents(params: any): Observable<any> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get(`${this.apiUrl}/query`, { params: httpParams });
  }
}
