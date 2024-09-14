import { AbstractControl, ValidationErrors } from '@angular/forms';

export class EcommerceValidators {
  // Whitespace validation
  static notOnlyWhitespace(control: AbstractControl): ValidationErrors | null {
    // check if string only has whitespace
    if (control.value != null && control.value.toString().trim().length === 0) {
      // invalid, return error object
      return { notOnlyWhitespace: true };
    } else {
      return null;
    }
  }
}
