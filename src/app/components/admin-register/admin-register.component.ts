import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { UserRegister } from '../../model/classes/user';
import { ToastrService } from 'ngx-toastr';
import { RegisterResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './admin-register.component.html',
  styleUrl: './admin-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRegisterComponent {

  private loginService: LoginService = inject(LoginService);

  private fb: FormBuilder = inject(FormBuilder);

  router: Router = inject(Router);

  userRegister: UserRegister = new UserRegister();

  toaster: ToastrService = inject(ToastrService);

  registerForm: FormGroup = this.fb.group({
    firstName: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][A-Za-z .]{2,}$")]),
    lastName: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][A-Za-z .]{2,}$")]),
    dob: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z 0-9.@-_]{8,}$")]),
    email: new FormControl('', [Validators.required, Validators.email])
  })

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.toaster.error("Form Invalid");
    } else {
      this.userRegister = this.registerForm.value;
      this.userRegister.role = 'ADMIN';
      this.userRegister.dob = this.formatDate(this.userRegister.dob);

      this.loginService.registerUser(this.userRegister).subscribe({
        next: (response: ResponseStructure<RegisterResponse>) => {
          if (response.status === 201) {
            this.toaster.success(response.message);
            this.registerForm.reset();
            this.router.navigateByUrl("/login");
          }
        },
        error: (error: ResponseStructure<RegisterResponse>) => {
          this.toaster.error(error.message);
        }
      })
    }
  }

  /**
   * Formats a date to 'YYYY-MM-DD'.
   * @param date Date to format
   * @returns Formatted date string
   */
  formatDate(date: any): string {
    if (date) {
      const formattedDate = new Date(date);
      const day = String(formattedDate.getDate()).padStart(2, '0');
      const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
      const year = formattedDate.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return '';
  }
}
