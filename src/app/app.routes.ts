import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { ShellLayoutComponent } from './layout/shell-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    component: ShellLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'rooms',
        loadComponent: () => import('./features/rooms/room-list/room-list.component').then(m => m.RoomListComponent)
      },
      {
        path: 'rooms/search',
        loadComponent: () => import('./features/rooms/room-search/room-search.component').then(m => m.RoomSearchComponent)
      },
      {
        path: 'rooms/new',
        loadComponent: () => import('./features/rooms/room-form/room-form.component').then(m => m.RoomFormComponent)
      },
      {
        path: 'rooms/:id/edit',
        loadComponent: () => import('./features/rooms/room-form/room-form.component').then(m => m.RoomFormComponent)
      },
      {
        path: 'reservations',
        loadComponent: () => import('./features/reservations/reservation-list/reservation-list.component').then(m => m.ReservationListComponent)
      },
      {
        path: 'reservations/new',
        loadComponent: () => import('./features/reservations/reservation-form/reservation-form.component').then(m => m.ReservationFormComponent)
      },
      {
        path: 'reservations/:id',
        loadComponent: () => import('./features/reservations/reservation-detail/reservation-detail.component').then(m => m.ReservationDetailComponent)
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./features/audit-logs/audit-log-list/audit-log-list.component').then(m => m.AuditLogListComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
