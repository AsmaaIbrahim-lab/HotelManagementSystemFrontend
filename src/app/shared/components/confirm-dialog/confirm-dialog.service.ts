import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly resultSubject = new Subject<boolean>();
  options: ConfirmOptions = { message: '' };
  visible = false;

  open(options: ConfirmOptions): Observable<boolean> {
    this.options = {
      title: 'Confirm',
      confirmText: 'Confirm',
      danger: false,
      ...options
    };
    this.visible = true;
    return new Observable<boolean>((subscriber) => {
      const sub = this.resultSubject.subscribe((result) => {
        subscriber.next(result);
        subscriber.complete();
      });
      return () => sub.unsubscribe();
    });
  }

  resolve(result: boolean): void {
    this.visible = false;
    this.resultSubject.next(result);
  }
}
