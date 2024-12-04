import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { StarshipService } from '../../services/starship.service';
import { Starship } from '../../models/starship';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-starships',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
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
  expandedShip: Starship | null = null;
  filtered: boolean = false;

  constructor(private starshipService: StarshipService) {}

  private splitManufacturers(manufacturer: string): string[] {
    const regex = /([^,]+(?:, Inc\.)?)/g;
    const matches = manufacturer.match(regex);

    return matches ? matches.map((m) => m.trim()) : [];
  }

  ngOnInit(): void {
    this.loadStarships();
  }

  loadStarships(): void {
    this.loading = true;
    this.starshipService
      .getStarships(this.currentPage)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.starshipsSubject.next(response.results);
          this.filteredStarshipsSubject.next(response.results);

          const allManufacturers = response.results.flatMap((ship) =>
            this.splitManufacturers(ship.manufacturer)
          );
          this.manufacturers = Array.from(new Set(allManufacturers));

          this.totalCount = response.count;
          this.totalPages = Math.ceil(this.totalCount / 10);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching starships:', error);
          this.loading = false;
        },
      });
  }

  filterByManufacturer(event: Event): void {
    const manufacturer = (event.target as HTMLSelectElement)?.value || '';
    const ships = this.starshipsSubject.value;

    const filteredShips = manufacturer
      ? ships.filter((ship) =>
          this.splitManufacturers(ship.manufacturer).includes(manufacturer)
        )
      : ships;

    if (manufacturer) {
      this.filtered = true;
      this.totalPages = Math.ceil(filteredShips.length / 10);
    } else {
      this.filtered = false;
      this.totalPages = Math.ceil(this.totalCount / 10);
    }

    this.filteredStarshipsSubject.next(filteredShips);
  }

  toggleDetails(ship: Starship): void {
    if (this.expandedShip === ship) {
      this.expandedShip = null;
    } else {
      this.expandedShip = ship;
    }
  }

  isExpanded(ship: Starship): boolean {
    return this.expandedShip === ship;
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
