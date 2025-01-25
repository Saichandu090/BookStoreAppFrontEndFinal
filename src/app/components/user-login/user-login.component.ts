import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginResponse, RegisterResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { Router } from '@angular/router';
import { LoggedInUser, NewPassword, UserRegister } from '../../model/classes/user';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APP_CONSTANTS } from '../../constants/constant';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {

  private loginService: LoginService = inject(LoginService);

  router: Router = inject(Router);

  userRegister: UserRegister = new UserRegister();

  toaster: ToastrService = inject(ToastrService);

  private snackBar = inject(MatSnackBar);

  currentUser: LoggedInUser = new LoggedInUser();

  isLogin = true;

  isForgotPassword = false;

  forgotPasswordForm!: FormGroup;

  isPasswordResetStage = false;

  loginForm!: FormGroup;

  registerForm!: FormGroup;

  private formBuilder: FormBuilder = inject(FormBuilder);

  constructor() {
    this.initializeForms();
  }

  initializeForms() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.formBuilder.group({
      firstName: ['', [
        Validators.required,
        Validators.pattern('^[A-Z][a-zA-Z .,\'-_=+]{2,}$')
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern('^[A-Z][a-zA-Z .,\'-_=+]{2,}$')
      ]],
      dob: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?/~`]).{8,}$')
      ]],
      email: ['', [Validators.required, Validators.email]]
    });


    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>?/~`]).{8,}$')]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  };

  passwordMatchValidator(form: FormGroup){
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    return newPassword && confirmPassword && newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  };

  toggleForm(): void {
    this.isLogin = !this.isLogin;
    this.loginForm.reset();
    this.registerForm.reset();
    this.isForgotPassword = false;
  };

  toggleForgotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
    this.isLogin = false;
    this.isPasswordResetStage = false;
    this.forgotPasswordForm.reset();
  }


  handleLogin(): void {
    if (this.loginForm.invalid) {
      this.toaster.error('Bad credentials');
      return;
    }
    this.loginService.loginUser(this.loginForm.value).subscribe({
      next: (response: ResponseStructure<LoginResponse>) => {
        if (response.status === 200 && response.data) {
          this.snackBar.open("Welcome to BookStore, Login Success!!", '', { duration: 3000 });
          this.currentUser = response.data;
          localStorage.setItem(APP_CONSTANTS.LOGIN_TOKEN, response.message);
          localStorage.setItem("UserDetails", JSON.stringify(response.data));
          this.router.navigateByUrl("/homepage");
        }
      },
      error: (error: any) => {
        if (error.error && error.error.message) {
          this.toaster.error(error.error.message);
        } else {
          this.toaster.error("Login failed");
        }
      }
    });
  };

  handleSignup(): void {
    if (this.registerForm.invalid) {
      this.toaster.error("Form Invalid");
    } else {
      this.userRegister = this.registerForm.value;
      this.userRegister.role = 'USER';
      this.userRegister.dob = this.formatDate(this.userRegister.dob);
      this.loginService.registerUser(this.userRegister).subscribe({
        next: (response: ResponseStructure<RegisterResponse>) => {
           if (response.status === 201) {
            this.toaster.success(response.message);
            this.registerForm.reset();
            this.isLogin = !this.isLogin;
          }
        },
        error: (error: any) => {
          if (error.error && error.error.message) {
            this.toaster.error(error.error.message);
          } else {
            this.toaster.error("Registration failed");
          }
        }
      });
    }
  };

  isUserExists(): void {
    const email: string = this.forgotPasswordForm.get('email')?.value;
    this.loginService.isUserExists(email).subscribe({
      next: (response: ResponseStructure<boolean>) => {
        if (response.status === 200 && response.data) {
          this.isPasswordResetStage = true;
        }
      },
      error: (error: any) => {
        if (error.error && error.error.message) {
          this.toaster.error(error.error.message);
        } else {
          this.toaster.error("User not exist");
        }
      }
    });
  };

  forgetPasswordObject: NewPassword = new NewPassword();

  handleForgotPassword(): void {
    if (!this.isPasswordResetStage) {
      if (this.forgotPasswordForm.valid) {
        this.isPasswordResetStage = true;
      }
    } else {
      if (this.forgotPasswordForm.valid) {
        this.forgetPasswordObject.email = this.forgotPasswordForm.get('email')?.value;
        this.forgetPasswordObject.password = this.forgotPasswordForm.get('newPassword')?.value;
        this.loginService.forgetPassword(this.forgetPasswordObject).subscribe({
          next: (response: ResponseStructure<boolean>) => {
            if (response.status === 200 && response.data) {
              this.snackBar.open(response.message, '', { duration: 3000 });
              this.forgotPasswordForm.reset();
              this.isForgotPassword = false;
              this.isLogin = true;
              this.isPasswordResetStage = false;
            }
          },
          error: (error: any) => {
            if (error.error && error.error.message) {
              this.toaster.error(error.error.message);
            }
          }
        });
      }
    };
  };


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
  };
}
