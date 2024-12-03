import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Starship } from '../models/starship';
import { PaginatedResponse } from '../models/paginated-response';

@Injectable({
  providedIn: 'root',
})
export class StarshipService {
  private apiUrl = 'https://swapi.dev/api/starships/';

  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of starships from the API.
   * @param page The page number to fetch (defaults to 1 if not provided).
   * @returns An Observable of starships and pagination data.
   */
  getStarships(page: number = 1): Observable<PaginatedResponse<Starship>> {
    return this.http.get<PaginatedResponse<Starship>>(
      `${this.apiUrl}?page=${page}`
    );
  }
}
