import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Room } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-room-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './room-search.component.html'
})
export class RoomSearchComponent {
  private readonly fb = inject(FormBuilder);
  private readonly roomService = inject(RoomService);
  private readonly notificationService = inject(NotificationService);

  loading = false;
  searched = false;
  rooms: Room[] = [];

  readonly roomTypes = ['', 'Standard', 'Deluxe', 'Suite', 'Executive'];

  readonly form = this.fb.nonNullable.group({
    roomType: [''],
    minPrice: [null as number | null],
    maxPrice: [null as number | null],
    checkInDate: [''],
    checkOutDate: ['']
  });

  search(): void {
    const value = this.form.getRawValue();
    if (value.checkInDate && value.checkOutDate && value.checkOutDate <= value.checkInDate) {
      this.notificationService.warning('Check-out must be after check-in.');
      return;
    }

    this.loading = true;
    this.searched = true;
    this.roomService.searchAvailable({
      roomType: value.roomType || undefined,
      minPrice: value.minPrice ?? undefined,
      maxPrice: value.maxPrice ?? undefined,
      checkInDate: value.checkInDate || undefined,
      checkOutDate: value.checkOutDate || undefined
    }).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Search failed.');
      }
    });
  }
}
