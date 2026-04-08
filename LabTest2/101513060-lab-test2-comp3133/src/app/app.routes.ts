import { Routes } from '@angular/router';
import { MissionlistComponent } from './missionlist/missionlist.component';

export const routes: Routes = [
  { path: '', component: MissionlistComponent },
  { path: '**', redirectTo: '' }
];