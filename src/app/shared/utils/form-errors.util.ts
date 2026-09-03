import { FormGroup } from '@angular/forms';
import { ApiValidationError } from '../../core/models';

export function applyApiErrorsToForm(form: FormGroup, error: ApiValidationError): void {
  if (!error?.errors) {
    return;
  }

  Object.entries(error.errors).forEach(([field, messages]) => {
    const control = form.get(field.charAt(0).toLowerCase() + field.slice(1)) ?? form.get(field);
    if (control && messages.length) {
      control.setErrors({ apiError: messages[0] });
      control.markAsTouched();
    }
  });
}

export function getControlError(form: FormGroup, controlName: string): string | null {
  const control = form.get(controlName);
  if (!control || !control.touched && !control.dirty) {
    return null;
  }
  if (control.errors?.['apiError']) {
    return control.errors['apiError'];
  }
  if (control.errors?.['required']) {
    return 'This field is required.';
  }
  if (control.errors?.['email']) {
    return 'Enter a valid email address.';
  }
  if (control.errors?.['min']) {
    return 'Value must be greater than 0.';
  }
  if (control.errors?.['checkoutBeforeCheckin']) {
    return 'Check-out must be after check-in.';
  }
  if (control.errors?.['minlength']) {
    return `Minimum length is ${control.errors['minlength'].requiredLength} characters.`;
  }
  return null;
}
