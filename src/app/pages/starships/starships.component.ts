import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { StarshipService } from '../../services/starship.service';
import { Starship } from '../../models/starship';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-starships',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.scss'],
})
export class StarshipsComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  private starshipsSubject = new BehaviorSubject<Starship[]>([]);
  private filteredStarshipsSubject = new BehaviorSubject<Starship[]>([]);

  starships$ = this.starshipsSubject.asObservable();
  filteredStarships$ = this.filteredStarshipsSubject.asObservable();

  manufacturers: string[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  totalCount: number = 0;
  loading: boolean = false;

  constructor(private starshipService: StarshipService) {}

  ngOnInit(): void {
    this.loadStarships();
  }

  loadStarships(): void {
    this.loading = true;
    this.starshipService
      .getStarships(this.currentPage)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          this.starshipsSubject.next(response.results);
          this.filteredStarshipsSubject.next(response.results);

          // Normalize manufacturers list
          const allManufacturers = response.results.flatMap((ship) =>
            this.splitManufacturers(ship.manufacturer)
          );
          this.manufacturers = Array.from(new Set(allManufacturers));

          this.totalCount = response.count;
          this.totalPages = Math.ceil(this.totalCount / 10);
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching starships:', error);
          this.loading = false;
        }
      );
  }

  filterByManufacturer(event: Event): void {
    const manufacturer = (event.target as HTMLSelectElement)?.value || '';
    const ships = this.starshipsSubject.value;

    const filteredShips = manufacturer
      ? ships.filter((ship) =>
          this.splitManufacturers(ship.manufacturer).includes(manufacturer)
        )
      : ships;

    this.currentPage = 1; // Reset to the first page
    this.filteredStarshipsSubject.next(filteredShips);

    // Recalculate total pages based on the filtered result
    if (manufacturer) {
      this.totalPages = Math.ceil(filteredShips.length / 10);
    } else {
      this.totalPages = Math.ceil(this.totalCount / 10);
    }
  }

  private splitManufacturers(manufacturer: string): string[] {
    // Match manufacturers, including special cases like "Gallofree Yards, Inc."
    const regex = /([^,]+(?:, Inc\.)?)/g;
    const matches = manufacturer.match(regex);

    // Return trimmed results
    return matches ? matches.map((m) => m.trim()) : [];
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadStarships();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
