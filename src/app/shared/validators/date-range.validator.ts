import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function checkoutAfterCheckinValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const checkIn = group.get('checkInDate')?.value;
    const checkOut = group.get('checkOutDate')?.value;
    if (checkIn && checkOut && checkOut <= checkIn) {
      group.get('checkOutDate')?.setErrors({ checkoutBeforeCheckin: true });
      return { checkoutBeforeCheckin: true };
    }
    return null;
  };
}
