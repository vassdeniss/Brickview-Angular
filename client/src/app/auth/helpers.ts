import { FormGroup } from '@angular/forms';

export function getFormValidationErrors(form: FormGroup) {
  const result: any[] = [];
  Object.keys(form.controls).forEach((key) => {
    const controlErrors = form.get(key)!.errors;
    if (controlErrors) {
      const language = localStorage.getItem('preferred-langauge') || 'bg';
      Object.keys(controlErrors).forEach((keyError) => {
        let message: string = '';
        if (keyError === 'required') {
          message = language === 'en' ? 'is required!' : 'е задълвително!';
        } else if (keyError === 'minlength') {
          message =
            language === 'en'
              ? `should be at least ${controlErrors[keyError].requiredLength} characters!`
              : `трябва да е поне ${controlErrors[keyError].requiredLength} символа`;
        } else if (keyError === 'maxlength') {
          message =
            language === 'en'
              ? `cannot be longer than ${controlErrors[keyError].requiredLength} characters long!`
              : `не може да е по-дълго от ${controlErrors[keyError].requiredLength} символа!`;
        } else if (keyError === 'email') {
          message = language === 'en' ? 'is not valid!' : 'не е валиден!';
        } else if (keyError === 'notSame') {
          message =
            language === 'en'
              ? 'must match repeat password!'
              : 'дшете пароли не съвпадат!';
        } else if (keyError === 'invalidLinks') {
          message =
            language === 'en'
              ? ' : Not all links are valid, or are not comma seperated!'
              : ' : Не всички линкове са валидни, или не са разделени със запетая!';
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
