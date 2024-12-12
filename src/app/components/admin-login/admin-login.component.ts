import { Component, inject } from '@angular/core';
import { ILogin } from '../../model/interfaces/userRegister';

import { Router, RouterLink } from '@angular/router';
import { Constant } from '../../constants/constant';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  loginObj:ILogin={
    email:"",
    password:''
  }

  private loginService=inject(LoginService);

  private router=inject(Router);

  onLogin(){
    this.loginService.loginUser(this.loginObj).subscribe((res:IJsonResponse)=>{
      if(res.result){
        alert("Login success")
        localStorage.setItem(Constant.LOGIN_TOKEN,res.message);
        localStorage.setItem("UserName",JSON.stringify(res.data));
        this.router.navigateByUrl("/admin-homepage");
      }else{
        alert("Login Failure")
      }
    })
  }
}
