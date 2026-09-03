import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-center align-items-center py-5" [class.fullscreen]="fullscreen">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      @if (message) {
        <span class="ms-3 text-muted">{{ message }}</span>
      }
    </div>
  `,
  styles: [`
    .fullscreen {
      min-height: 40vh;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message = '';
  @Input() fullscreen = false;
}
