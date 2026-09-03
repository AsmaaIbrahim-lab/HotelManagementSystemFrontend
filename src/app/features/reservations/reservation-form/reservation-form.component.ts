import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReservationService } from '../../../core/services/reservation.service';
import { RoomService } from '../../../core/services/room.service';
import { NotificationService } from '../../../core/services/notification.service';
import { applyApiErrorsToForm, getControlError } from '../../../shared/utils/form-errors.util';
import { checkoutAfterCheckinValidator } from '../../../shared/validators/date-range.validator';
import { ApiValidationError, Reservation, Room, getApiErrorMessage } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './reservation-form.component.html'
})
export class ReservationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reservationService = inject(ReservationService);
  private readonly roomService = inject(RoomService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  loadingRooms = true;
  saving = false;
  createdReservation: Reservation | null = null;
  availableRooms: Room[] = [];

  readonly form = this.fb.nonNullable.group({
    roomId: [0, [Validators.required, Validators.min(1)]],
    guestName: ['', Validators.required],
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required]
  }, { validators: checkoutAfterCheckinValidator() });

  getControlError = getControlError.bind(null, this.form);
ngOnInit(): void {
  this.form.get('checkInDate')?.valueChanges.subscribe(() => {
    this.onDatesChanged();
  });

  this.form.get('checkOutDate')?.valueChanges.subscribe(() => {
    this.onDatesChanged();
  });
}

onDatesChanged(): void {
  const { checkInDate, checkOutDate } = this.form.getRawValue();

  if (!checkInDate || !checkOutDate) {
    this.availableRooms = [];
    return;
  }

  if (checkOutDate <= checkInDate) {
    this.availableRooms = [];
    return;
  }

  this.loadAvailableRooms(checkInDate, checkOutDate);
}

loadAvailableRooms(checkIn: string, checkOut: string): void {
  this.loadingRooms = true;

  this.roomService.searchAvailable({
    checkInDate: checkIn,
    checkOutDate: checkOut
  }).subscribe({
    next: (rooms) => {
      this.availableRooms = rooms;
      this.loadingRooms = false;
    },
    error: () => {
      this.availableRooms = [];
      this.loadingRooms = false;
      this.notificationService.error(
        'Failed to load available rooms.'
      );
    }
  });
}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.reservationService.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.notificationService.success('Reservation created successfully.');
      },
      error: (err: ApiValidationError) => {
        this.saving = false;
        if (err?.errors) {
          applyApiErrorsToForm(this.form, err);
        } else {
          this.notificationService.error(getApiErrorMessage(err));
        }
      }
    });
  }

  goToList(): void {
    void this.router.navigate(['/reservations']);
  }
}
