import { Component, OnInit } from '@angular/core';
import { StarshipService } from '../../services/starship.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-starships',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.scss'],
})
export class StarshipsComponent implements OnInit {
  starships: any[] = [];
  filteredStarships: any[] = [];
  manufacturers: string[] = [];

  constructor(private starshipService: StarshipService) {}

  ngOnInit(): void {
    this.starshipService.getStarships().subscribe((data) => {
      this.starships = data.results;
      this.filteredStarships = [...this.starships];
      this.manufacturers = Array.from(
        new Set(this.starships.map((ship) => ship.manufacturer))
      );
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
}
