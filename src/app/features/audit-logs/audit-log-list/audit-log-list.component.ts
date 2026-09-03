import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogService } from '../../../core/services/audit-log.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuditLog, PagedResult } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-audit-log-list',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './audit-log-list.component.html'
})
export class AuditLogListComponent implements OnInit {

  private readonly auditLogService = inject(AuditLogService);
  private readonly notificationService = inject(NotificationService);

  loading = true;

  logs: AuditLog[] = [];

  page = 1;
  pageSize = 20;
  totalCount = 0;
  isPaged = false;

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(page = 1): void {
    this.loading = true;
    this.page = page;

    this.auditLogService.getAll({
      page: this.page,
      pageSize: this.pageSize
    }).subscribe({
      next: (result) => {

        if (this.isPagedResult(result)) {
          this.isPaged = true;
          this.logs = result.items;
          this.totalCount = result.totalCount;
        } else {
          this.isPaged = false;
          this.logs = result;
          this.totalCount = result.length;
        }

        this.loading = false;
      },

      error: () => {
        this.loading = false;
        this.notificationService.error(
          'Failed to load audit logs.'
        );
      }
    });
  }

  get totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.totalCount / this.pageSize)
    );
  }

  private isPagedResult(
    result: PagedResult<AuditLog> | AuditLog[]
  ): result is PagedResult<AuditLog> {

    return !Array.isArray(result) && 'items' in result;
  }
}