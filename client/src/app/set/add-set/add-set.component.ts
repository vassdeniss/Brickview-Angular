import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getFormValidationErrors } from 'src/app/auth/helpers';
import { PopupService } from 'src/app/services/popup.service';
import { SetService } from 'src/app/services/set.service';

@Component({
  selector: 'app-add-set',
  templateUrl: './add-set.component.html',
  styleUrls: ['./add-set.component.css'],
})
export class AddSetComponent {
  setForm = this.fb.group({
    setId: ['', [Validators.required]],
  });
  errors: string[] = [];

  constructor(
    private route: Router,
    private fb: FormBuilder,
    public popup: PopupService,
    private set: SetService
  ) {}

  onSubmit(button: HTMLButtonElement): void {
    button.disabled = true;
    if (this.setForm.invalid) {
      this.errors = [];
      const errors = getFormValidationErrors(this.setForm);
      errors.forEach((error) => {
        this.errors.push(`${error.control} ${error.message}`);
      });
      this.popup.show();
      button.disabled = false;
      return;
    }

    this.set.addSet(this.setForm.value.setId!).subscribe({
      next: () => {
        this.route.navigate(['sets/my-sets']);
      },
      error: (err) => {
        this.errors = [];
        this.errors.push(err.error.message);
        this.popup.show();
        button.disabled = false;
      },
    });
  }
}
