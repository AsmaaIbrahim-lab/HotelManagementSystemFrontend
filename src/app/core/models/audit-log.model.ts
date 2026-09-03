export interface AuditLog {
  id: number;
  action: string;
  entityName: string;
  entityId: number;
  userId: string;
  actionDate: string;
  details: string;
}

export interface AuditLogSearchQuery {
  entityName?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
