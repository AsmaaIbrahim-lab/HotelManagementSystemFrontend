import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from '../shared/components/confirm-dialog/confirm-dialog.service';
import { ToastContainerComponent } from '../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ConfirmDialogComponent, ToastContainerComponent],
  templateUrl: './shell-layout.component.html',
  styleUrl: './shell-layout.component.scss'
})
export class ShellLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly confirmDialog = inject(ConfirmDialogService);

  readonly navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/rooms', label: 'Rooms', icon: 'bi-door-open' },
    { path: '/reservations', label: 'Reservations', icon: 'bi-calendar-check' },
    { path: '/audit-logs', label: 'Audit Logs', icon: 'bi-journal-text' },
    { path: '/reports', label: 'Reports', icon: 'bi-bar-chart' }
  ];

  logout(): void {
    this.authService.logout();
  }

  onConfirm(): void {
    this.confirmDialog.resolve(true);
  }

  onCancel(): void {
    this.confirmDialog.resolve(false);
  }
}
