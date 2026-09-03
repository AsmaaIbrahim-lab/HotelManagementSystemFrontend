import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReservationService } from '../../../core/services/reservation.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { Reservation, ReservationStatus } from '../../../core/models';
import { getApiErrorMessage } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './reservation-list.component.html'
})
export class ReservationListComponent implements OnInit, OnDestroy {
  private readonly reservationService = inject(ReservationService);
  private readonly signalRService = inject(SignalRService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private subs = new Subscription();

  loading = true;
  reservations: Reservation[] = [];
  readonly statuses = Object.values(ReservationStatus);

  readonly filterForm = inject(FormBuilder).nonNullable.group({
    guestName: [''],
    roomNumber: [''],
    checkInDate: [''],
    checkOutDate: [''],
    status: ['']
  });

  ngOnInit(): void {
    this.loadReservations();
    this.subs.add(
      this.signalRService.reservationCreated$.subscribe((reservation) => {
        this.upsertReservation(reservation);
        this.notificationService.info(`Reservation created for ${reservation.guestName}.`);
      })
    );
    this.subs.add(
      this.signalRService.reservationCancelled$.subscribe(({ id }) => {
        const existing = this.reservations.find((r) => r.id === id);
        if (existing) {
          existing.status = ReservationStatus.Cancelled;
          this.reservations = [...this.reservations];
        } else {
          this.loadReservations();
        }
        this.notificationService.warning('A reservation was cancelled.');
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadReservations(): void {
    this.loading = true;
    const filters = this.filterForm.getRawValue();
    const hasFilters = Object.values(filters).some((v) => !!v);

    const request$ = hasFilters
      ? this.reservationService.search({
          guestName: filters.guestName || undefined,
          roomNumber: filters.roomNumber || undefined,
          checkInDate: filters.checkInDate || undefined,
          checkOutDate: filters.checkOutDate || undefined,
          status: filters.status || undefined
        })
      : this.reservationService.getAll();

    request$.subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load reservations.');
      }
    });
  }

  clearFilters(): void {
    this.filterForm.reset({
      guestName: '',
      roomNumber: '',
      checkInDate: '',
      checkOutDate: '',
      status: ''
    });
    this.loadReservations();
  }

  cancelReservation(reservation: Reservation): void {
    if (reservation.status === ReservationStatus.Cancelled) {
      this.notificationService.warning('This reservation is already cancelled.');
      return;
    }

    this.confirmDialog.open({
      title: 'Cancel Reservation',
      message: `Cancel reservation for ${reservation.guestName}?`,
      confirmText: 'Cancel Reservation',
      danger: true
    }).subscribe((confirmed) => {
      if (!confirmed) return;
      this.reservationService.cancel(reservation.id).subscribe({
        next: (updated) => {
          this.upsertReservation(updated);
          this.notificationService.success('Reservation cancelled.');
        },
        error: (err) => {
          this.notificationService.error(getApiErrorMessage(err));
        }
      });
    });
  }

  private upsertReservation(reservation: Reservation): void {
    const index = this.reservations.findIndex((r) => r.id === reservation.id);
    if (index >= 0) {
      this.reservations[index] = reservation;
    } else {
      this.reservations = [reservation, ...this.reservations];
    }
    this.reservations = [...this.reservations];
  }
}
