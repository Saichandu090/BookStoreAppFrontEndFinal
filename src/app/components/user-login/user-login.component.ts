import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginResponse, RegisterResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { Router } from '@angular/router';
import { LoggedInUser, UserRegister } from '../../model/classes/user';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Constant } from '../../constants/constant';

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

  private snackBar=inject(MatSnackBar);

  currentUser:LoggedInUser=new LoggedInUser();

  isLogin = true;
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      firstName: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][A-Za-z .]{2,}$")]),
      lastName: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][A-Za-z .]{2,}$")]),
      dob: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z 0-9.@-_]{8,}$")]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  toggleForm(): void {
    this.isLogin = !this.isLogin;
    this.loginForm.reset();
    this.registerForm.reset();
  }

  handleLogin(): void {
    this.loginService.loginUser(this.loginForm.value).subscribe({
      next: (response:ResponseStructure<LoginResponse>) => {
        if (response.status===200) {
          this.snackBar.open("Welcome to BookStore, Login Success!!",'',{duration : 3000});
          this.currentUser = response.data;
          localStorage.setItem(Constant.LOGIN_TOKEN, response.message);
          localStorage.setItem("UserDetails", JSON.stringify(response.data));
          this.router.navigateByUrl("/homepage");
        } else {
          this.toaster.error(response.message);
        }
      },
      error: (error:ResponseStructure<LoginResponse>) => {
        this.toaster.error(error.message);
      }});
  }

  handleSignup(): void {
    if (this.registerForm.invalid) {
      this.toaster.error("Form Invalid");
    } else {
      this.userRegister = this.registerForm.value;
      this.userRegister.role = 'USER';
      this.userRegister.dob = this.formatDate(this.userRegister.dob)
      console.log(this.userRegister)

      this.loginService.registerUser(this.userRegister).subscribe({
        next: (response: ResponseStructure<RegisterResponse>) => {
          if (response.status === 201) {
            this.toaster.success(response.message);
            this.registerForm.reset();
            this.isLogin = !this.isLogin;
          }
        },
        error: (error: ResponseStructure<RegisterResponse>) => {
          this.toaster.error(error.message);
        }
      })
    }
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
  }
}
