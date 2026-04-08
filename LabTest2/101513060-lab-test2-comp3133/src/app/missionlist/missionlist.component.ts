import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Mission } from '../models/mission';
import { SpacexService } from '../services/spacex.service';
import { MissionfilterComponent } from '../missionfilter/missionfilter.component';
import { MissiondetailsComponent } from '../missiondetails/missiondetails.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-missionlist',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MissionfilterComponent,
    MissiondetailsComponent
  ],
  templateUrl: './missionlist.component.html',
  styleUrl: './missionlist.component.css'
})
export class MissionlistComponent implements OnInit {
  private readonly spacexService = inject(SpacexService);

  readonly missions = signal<Mission[]>([]);
  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly selectedMission = signal<Mission | null>(null);

  ngOnInit(): void {
    this.loadAllMissions();
  }

  loadAllMissions(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.spacexService.getAllMissions().subscribe({
      next: (data) => {
        this.missions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load SpaceX missions.');
        this.loading.set(false);
      }
    });
  }

  onYearSelected(year: string): void {
    this.selectedMission.set(null);

    if (!year) {
      this.loadAllMissions();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.spacexService.getMissionsByYear(year).subscribe({
      next: (data) => {
        this.missions.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to filter missions.');
        this.loading.set(false);
      }
    });
  }

  viewDetails(mission: Mission): void {
    this.selectedMission.set(mission);
  }
}