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
  loading: boolean = false;

  constructor(private starshipService: StarshipService) {}

  ngOnInit(): void {
    this.loadStarships(this.currentPage);
  }

  loadStarships(page: number): void {
    this.loading = true; // Start loading animation
    this.starshipService
      .getStarships(page)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (response) => {
          this.starshipsSubject.next(response.results);
          this.filteredStarshipsSubject.next(response.results);
          this.manufacturers = Array.from(
            new Set(response.results.map((ship) => ship.manufacturer))
          );
          this.totalPages = Math.ceil(response.count / 10);
          this.loading = false; // Stop loading animation
        },
        (error) => {
          console.error('Error fetching starships:', error);
          this.loading = false; // Stop loading animation on error
        }
      );
  }

  filterByManufacturer(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const manufacturer = target?.value || '';
    this.starships$.pipe(takeUntil(this.unsubscribe$)).subscribe((ships) => {
      if (manufacturer) {
        this.filteredStarshipsSubject.next(
          ships.filter((ship) => ship.manufacturer.includes(manufacturer))
        );
      } else {
        this.filteredStarshipsSubject.next(ships);
      }
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadStarships(page);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
