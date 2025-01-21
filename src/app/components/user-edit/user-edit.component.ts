import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoggedInUser, UserEdit, UserRegister } from '../../model/classes/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../services/login/login.service';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { first } from 'rxjs';


@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);

  private loginService = inject(LoginService);

  router: Router = inject(Router);

  userEdit: UserEdit = new UserEdit();

  snackBar = inject(MatSnackBar);

  //toaster = inject(ToastrService);

  registerForm: FormGroup = this.fb.group({
    firstName: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][A-Za-z .]{2,}$")]),
    lastName: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][A-Za-z .]{2,}$")]),
    dob: new FormControl('', [Validators.required]),
  })


  currentUser: LoggedInUser = new LoggedInUser();

  getCurrentUser() {
    const user = localStorage.getItem("UserDetails");
    if (user != null) {
      const pardedUser = JSON.parse(user);
      this.currentUser = pardedUser[0];
      console.log(this.currentUser.email)
      console.log(this.currentUser.role)
      this.getUser();
    }
  }

  getUser() {
    this.loginService.getUser(this.currentUser.email).subscribe({
      next: (res: IJsonResponse) => {
        if (res.result) {
          this.userEdit = res.data

          this.registerForm.patchValue({
            firstName: this.userEdit.firstName,
            lastName: this.userEdit.lastName,
            dob: this.userEdit.dob,
          })
        }
      },
      error: (res: IJsonResponse) => {
        this.snackBar.open(res.message, '', { duration: 3000 });
      }
    })
  }


  onSubmit() {
    if (this.registerForm.invalid) {
      this.snackBar.open("Form Invalid", '', { duration: 3000 });
      console.log(this.registerForm.value)
    } else {
      this.userEdit = this.registerForm.value;
      this.userEdit.dob = this.formatDate(this.userEdit.dob);
      console.log(this.userEdit);
      this.loginService.editUser(this.userEdit).subscribe({
        next: (res: IJsonResponse) => {
          if (res.result) {
            this.snackBar.open(res.message, '', { duration: 3000 })
          }
        },
        error: (res: IJsonResponse) => {
          this.snackBar.open(res.message, '', { duration: 3000 });
        }

      })
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
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

  ngOnInit(): void {
    this.getCurrentUser();
  }
}
