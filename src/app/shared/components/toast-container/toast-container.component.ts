import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, ToastMessage } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1090">
      @for (toast of toasts; track toast.id) {
        <div class="toast show mb-2 border-0 shadow" role="alert">
          <div class="toast-header" [ngClass]="headerClass(toast.type)">
            <strong class="me-auto">{{ titleFor(toast.type) }}</strong>
            <button type="button" class="btn-close" (click)="remove(toast.id)"></button>
          </div>
          <div class="toast-body">{{ toast.message }}</div>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private sub?: Subscription;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.sub = this.notificationService.toasts$.subscribe((toast) => {
      this.toasts = [...this.toasts, toast];
      const timer = setTimeout(() => this.remove(toast.id), 5000);
      this.timers.set(toast.id, timer);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.timers.forEach((timer) => clearTimeout(timer));
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  headerClass(type: ToastMessage['type']): string {
    switch (type) {
      case 'success': return 'bg-success text-white';
      case 'error': return 'bg-danger text-white';
      case 'warning': return 'bg-warning';
      default: return 'bg-info text-white';
    }
  }

  titleFor(type: ToastMessage['type']): string {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      default: return 'Info';
    }
  }
}
