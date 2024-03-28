import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function plzNaeheValidator(plz: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value && String(plz).slice(0, 2) !== String(value).slice(0, 2)) {
      return { plzNaehe: true };
    } else if (control.errors) {
      delete control.errors['plzNaehe'];
      return control.errors;
    }
    return null;
  };
}

export function plzLengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value && String(value).length != 5) {
      return { length: true };
    } else if (control.errors) {
      delete control.errors['length'];
      return control.errors;
    }
    return null;
  };
}
