import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { Reservation, ReservationStatus } from '../../../core/models';
import { getApiErrorMessage } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './reservation-detail.component.html'
})
export class ReservationDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly reservationService = inject(ReservationService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  loading = true;
  reservation: Reservation | null = null;

  ngOnInit(): void {
    const id = +(this.route.snapshot.paramMap.get('id') ?? 0);
    this.reservationService.getById(id).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Reservation not found.');
      }
    });
  }

  cancel(): void {
    if (!this.reservation) return;
    if (this.reservation.status === ReservationStatus.Cancelled) {
      this.notificationService.warning('This reservation is already cancelled.');
      return;
    }

    this.confirmDialog.open({
      title: 'Cancel Reservation',
      message: `Cancel reservation for ${this.reservation.guestName}?`,
      confirmText: 'Cancel Reservation',
      danger: true
    }).subscribe((confirmed) => {
      if (!confirmed || !this.reservation) return;
      this.reservationService.cancel(this.reservation.id).subscribe({
        next: (updated) => {
          this.reservation = updated;
          this.notificationService.success('Reservation cancelled.');
        },
        error: (err) => {
          this.notificationService.error(getApiErrorMessage(err));
        }
      });
    });
  }
}
