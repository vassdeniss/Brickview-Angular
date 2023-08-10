import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getFormValidationErrors } from 'src/app/auth/helpers';
import { PopupService } from 'src/app/services/popup.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css'],
})
export class EditInfoComponent implements OnInit {
  editForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    profilePicture: null,
    deleteProfilePicture: false,
  });
  currentProfilePicture: string | null = null;
  errors: string[] = [];

  constructor(
    private fb: FormBuilder,
    public popup: PopupService,
    private activated: ActivatedRoute,
    private route: Router,
    private user: UserService
  ) {}

  ngOnInit(): void {
    this.editForm.patchValue({ profilePicture: localStorage.getItem('image') });
    this.currentProfilePicture = this.editForm.get('profilePicture')?.value;
    this.activated.queryParams.subscribe((params) => {
      this.editForm.patchValue({ username: params['username'] });
    });
  }

  /* istanbul ignore next */
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.editForm.patchValue({ profilePicture: file });

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.currentProfilePicture = reader.result as string;
        this.editForm.patchValue({ profilePicture: reader.result as string });
      };
    }
  }

  onSubmit(button: HTMLButtonElement): void {
    button.disabled = true;
    if (this.editForm.invalid) {
      this.errors = [];
      const errors = getFormValidationErrors(this.editForm);
      errors.forEach((error) => {
        this.errors.push(`${error.control} ${error.message}`);
      });
      this.popup.show();
      button.disabled = false;
      return;
    }

    this.user.editUser(this.editForm.value).subscribe({
      complete: () => {
        button.disabled = false;
        if (this.editForm.get('deleteProfilePicture')?.value) {
          localStorage.removeItem('image');
        } else {
          localStorage.setItem('image', this.currentProfilePicture as string);
        }
        this.route.navigate(['users/my-profile']);
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
