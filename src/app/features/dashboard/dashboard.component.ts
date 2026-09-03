import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { SignalRService } from '../../core/services/signalr.service';
import { NotificationService } from '../../core/services/notification.service';
import { OccupancySummary, Reservation } from '../../core/models';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly dashboardService = inject(DashboardService);
  private readonly signalRService = inject(SignalRService);
  private readonly notificationService = inject(NotificationService);
  private subs = new Subscription();

  loading = true;
  summary: OccupancySummary | null = null;
  recentReservations: Reservation[] = [];

  ngOnInit(): void {
    this.loadData();
    this.subs.add(
      this.signalRService.reservationCreated$.subscribe((reservation) => {
        this.notificationService.info(`New reservation for ${reservation.guestName} (Room ${reservation.roomNumber ?? reservation.roomId})`);
        this.loadData();
      })
    );
    this.subs.add(
      this.signalRService.reservationCancelled$.subscribe(() => {
        this.notificationService.warning('A reservation was cancelled by another user.');
        this.loadData();
      })
    );
      this.subs.add(
      this.signalRService.reservationCancelled$.subscribe(() => {
        this.notificationService.warning('A reservation was cancelled by another user.');
        this.loadData();
      })
    );
    this.subs.add(
      this.signalRService.roomUpdated$.subscribe((room) => {
        this.notificationService.info(`Room ${room.roomNumber} was updated.`);
        this.loadData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      summary: this.dashboardService.getOccupancySummary(),
      recent: this.dashboardService.getRecentReservations(8)
    }).subscribe({
      next: ({ summary, recent }) => {
        this.summary = summary;
        this.recentReservations = recent;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load dashboard data.');
      }
    });
  }
}
