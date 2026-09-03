import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoomService } from '../../../core/services/room.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { Room } from '../../../core/models';
import { getApiErrorMessage } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './room-list.component.html'
})
export class RoomListComponent implements OnInit, OnDestroy {
  private readonly roomService = inject(RoomService);
  private readonly signalRService = inject(SignalRService);
  private readonly notificationService = inject(NotificationService);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private subs = new Subscription();

  loading = true;
  rooms: Room[] = [];

  ngOnInit(): void {
    this.loadRooms();
    this.subs.add(
      this.signalRService.roomUpdated$.subscribe((room) => {
        const index = this.rooms.findIndex((r) => r.id === room.id);
        if (index >= 0) {
          this.rooms[index] = room;
          this.rooms = [...this.rooms];
        } else {
          this.loadRooms();
        }
        this.notificationService.info(`Room ${room.roomNumber} updated live.`);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadRooms(): void {
    this.loading = true;
    this.roomService.getAll().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load rooms.');
      }
    });
  }

  deleteRoom(room: Room): void {
    this.confirmDialog.open({
      title: 'Delete Room',
      message: `Delete room ${room.roomNumber}? This cannot be undone.`,
      confirmText: 'Delete',
      danger: true
    }).subscribe((confirmed) => {
      if (!confirmed) return;
      this.roomService.delete(room.id).subscribe({
        next: () => {
          this.rooms = this.rooms.filter((r) => r.id !== room.id);
          this.notificationService.success('Room deleted.');
        },
        error: (err) => {
          this.notificationService.error(getApiErrorMessage(err));
        }
      });
    });
  }
}
