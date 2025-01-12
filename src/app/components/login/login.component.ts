import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ILogin } from '../../model/interfaces/userRegister';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { Constant } from '../../constants/constant';
import { LoginService } from '../../services/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { LoggedInUser } from '../../model/classes/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private snackBar = inject(MatSnackBar);

  loginObj:ILogin={
    email:"",
    password:''
  }

  private loginService=inject(LoginService);

  private router=inject(Router);

  currentUser:LoggedInUser=new LoggedInUser();

  onLogin() {
    this.loginService.loginUser(this.loginObj).subscribe({
      next: (res: IJsonResponse) => {
        if (res.result) {
          this.snackBar.open("Welcome to BookStore, Login Success!!",'',{duration : 3000});
          console.log(res.data);
          this.currentUser = res.data;
          localStorage.setItem(Constant.LOGIN_TOKEN, res.message);
          localStorage.setItem("UserDetails", JSON.stringify(res.data));
          this.router.navigateByUrl("/homepage");
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        console.error("Error from backend:", err);
        const message = err.error?.message || "Something went wrong!";
        this.toastr.error(message);
      }
    });
  }


  constructor(private toastr: ToastrService) {}
}
