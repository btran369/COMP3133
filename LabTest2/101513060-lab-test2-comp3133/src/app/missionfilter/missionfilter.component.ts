import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-missionfilter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './missionfilter.component.html',
  styleUrl: './missionfilter.component.css'
})
export class MissionfilterComponent {
  @Output() yearSelected = new EventEmitter<string>();

  readonly years = signal([
    '2006', '2007', '2008', '2009', '2010',
    '2011', '2012', '2013', '2014', '2015',
    '2016', '2017', '2018', '2019', '2020'
  ]);

  readonly filterForm = new FormGroup({
    launchYear: new FormControl<string>('', { nonNullable: true })
  });

  applyFilter(): void {
    const year = this.filterForm.controls.launchYear.value.trim();
    this.yearSelected.emit(year);
  }

  chooseYear(year: string): void {
    this.filterForm.controls.launchYear.setValue(year);
    this.yearSelected.emit(year);
  }

  clearFilter(): void {
    this.filterForm.reset({ launchYear: '' });
    this.yearSelected.emit('');
  }
}