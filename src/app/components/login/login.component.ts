import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ILogin } from '../../model/interfaces/userRegister';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { Constant } from '../../constants/constant';
import { LoginService } from '../../services/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { LoggedInUser } from '../../model/classes/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj:ILogin={
    email:"",
    password:''
  }

  private loginService=inject(LoginService);

  private router=inject(Router);

  currentUser:LoggedInUser=new LoggedInUser();
  
  onLogin(){
    this.loginService.loginUser(this.loginObj).subscribe((res:IJsonResponse)=>{
      if(res.result){
        this.showSuccess()
        console.log(res.data)
        this.currentUser=res.data;
        localStorage.setItem(Constant.LOGIN_TOKEN,res.message);
        localStorage.setItem("UserDetails",JSON.stringify(res.data));
        this.router.navigateByUrl("/homepage");
      }else{
        alert("Login Failure")
      }
    })
  }

  constructor(private toastr: ToastrService) {}
  
    showSuccess() {
      this.toastr.success('Login Successfull');
    }

}
