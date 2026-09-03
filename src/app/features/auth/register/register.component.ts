import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { applyApiErrorsToForm, getControlError } from '../../../shared/utils/form-errors.util';
import { ApiValidationError, getApiErrorMessage } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  loading = false;
  apiError = '';

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  getControlError = getControlError.bind(null, this.form);

  submit(): void {
    this.apiError = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Registration successful. Please sign in.');
        void this.router.navigate(['/login']);
      },
      error: (err: ApiValidationError) => {
        this.loading = false;
        if (err?.errors) {
          applyApiErrorsToForm(this.form, err);
        } else {
          this.apiError = getApiErrorMessage(err);
          this.notificationService.error(this.apiError);
        }
      }
    });
  }
}
