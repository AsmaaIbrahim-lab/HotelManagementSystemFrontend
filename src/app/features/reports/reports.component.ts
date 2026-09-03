import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  OccupancyReportItem,
  RevenueReport,
  TopRoomReport
} from '../../core/models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

type ReportTab = 'top-rooms' | 'revenue' | 'occupancy';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  private readonly reportService = inject(ReportService);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  activeTab: ReportTab = 'top-rooms';
  loading = false;

  topRooms: TopRoomReport[] = [];
  revenueReport: RevenueReport | null = null;
  occupancyReport: OccupancyReportItem[] = [];

  readonly dateForm = this.fb.nonNullable.group({
    from: ['', Validators.required],
    to: ['', Validators.required],
    take: [5, [Validators.min(1), Validators.max(20)]]
  });

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.loadActiveReport();
  }

  setTab(tab: ReportTab): void {
    this.activeTab = tab;
    this.loadActiveReport();
  }

  loadActiveReport(): void {
    switch (this.activeTab) {
      case 'top-rooms':
        this.loadTopRooms();
        break;
      case 'revenue':
        this.loadRevenue();
        break;
      case 'occupancy':
        this.loadOccupancy();
        break;
    }
  }

  private setDefaultDateRange(): void {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);

    this.dateForm.patchValue({
      from: this.formatDate(from),
      to: this.formatDate(to)
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadTopRooms(): void {
    this.loading = true;
    const take = this.dateForm.get('take')?.value ?? 5;

    this.reportService.getTopRooms(take).subscribe({
      next: (data) => {
        this.topRooms = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load top rooms report.');
      }
    });
  }

  loadRevenue(): void {
    const { from, to } = this.dateForm.getRawValue();
    if (!from || !to) {
      this.notificationService.error('Please select both From and To dates.');
      return;
    }

    this.loading = true;
    this.reportService.getRevenue({ from, to }).subscribe({
      next: (data) => {
        this.revenueReport = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load revenue report.');
      }
    });
  }

  loadOccupancy(): void {
    const { from, to } = this.dateForm.getRawValue();
    if (!from || !to) {
      this.notificationService.error('Please select both From and To dates.');
      return;
    }

    this.loading = true;
    this.reportService.getOccupancy({ from, to }).subscribe({
      next: (data) => {
        this.occupancyReport = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load occupancy report.');
      }
    });
  }
}
