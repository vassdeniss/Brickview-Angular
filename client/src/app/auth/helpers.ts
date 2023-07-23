import { FormGroup } from '@angular/forms';

export function getFormValidationErrors(form: FormGroup) {
  const result: any[] = [];
  Object.keys(form.controls).forEach((key) => {
    const controlErrors = form.get(key)!.errors;
    if (controlErrors) {
      Object.keys(controlErrors).forEach((keyError) => {
        let message: string = '';
        if (keyError === 'required') {
          message = 'is required!';
        } else if (keyError === 'minlength') {
          message = `should be at least ${controlErrors[keyError].requiredLength} characters!`;
        } else if (keyError === 'maxlength') {
          message = `cannot be longer than ${controlErrors[keyError].requiredLength} characters long!`;
        } else if (keyError === 'email') {
          message = 'is not valid!';
        } else if (keyError === 'notSame') {
          message = 'must match repeat password!';
        }

        result.push({
          control: key,
          error: keyError,
          value: controlErrors[keyError],
          message,
        });
      });
    }
  });

  return result;
}
