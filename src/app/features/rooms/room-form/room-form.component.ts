import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { NotificationService } from '../../../core/services/notification.service';
import { applyApiErrorsToForm, getControlError } from '../../../shared/utils/form-errors.util';
import { ApiValidationError, getApiErrorMessage } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './room-form.component.html'
})
export class RoomFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly roomService = inject(RoomService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  loading = false;
  saving = false;
  isEdit = false;
  roomId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    roomNumber: ['', Validators.required],
    roomType: ['Standard', Validators.required],
    pricePerNight: [0, [Validators.required, Validators.min(0.01)]]
  });

  readonly roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive'];

  getControlError = getControlError.bind(null, this.form);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.roomId = +id;
      this.loadRoom(this.roomId);
    }
  }

  loadRoom(id: number): void {
    this.loading = true;
    this.roomService.getById(id).subscribe({
      next: (room) => {
        this.form.patchValue({
          roomNumber: room.roomNumber,
          roomType: room.roomType,
          pricePerNight: room.pricePerNight
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Room not found.');
        void this.router.navigate(['/rooms']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const request = this.form.getRawValue();
    const action$ = this.isEdit && this.roomId
      ? this.roomService.update(this.roomId, request)
      : this.roomService.create(request);

    action$.subscribe({
      next: () => {
        this.saving = false;
        this.notificationService.success(this.isEdit ? 'Room updated.' : 'Room created.');
        void this.router.navigate(['/rooms']);
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
}
