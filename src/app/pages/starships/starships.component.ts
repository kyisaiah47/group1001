import { Component, OnInit } from '@angular/core';
import { StarshipService } from '../../services/starship.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Starship } from '../../models/starship';

@Component({
  selector: 'app-starships',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.scss'],
})
export class StarshipsComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  starships: Starship[] = [];
  filteredStarships: Starship[] = [];
  manufacturers: string[] = [];
  currentPage: number = 1;
  totalPages: number = 0;

  constructor(private starshipService: StarshipService) {}

  ngOnInit(): void {
    this.loadStarships(this.currentPage);
  }

  loadStarships(page: number): void {
    this.starshipService
      .getStarships(page)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.starships = response.results;
        this.filteredStarships = [...this.starships];
        this.manufacturers = Array.from(
          new Set(this.starships.map((ship) => ship.manufacturer))
        );
        this.totalPages = Math.ceil(response.count / 10);
      });
  }

  filterByManufacturer(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const manufacturer = target?.value || ''; // Default to empty string if null
    if (manufacturer) {
      this.filteredStarships = this.starships.filter((ship) =>
        ship.manufacturer.includes(manufacturer)
      );
    } else {
      this.filteredStarships = [...this.starships];
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadStarships(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadStarships(this.currentPage);
    }
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
