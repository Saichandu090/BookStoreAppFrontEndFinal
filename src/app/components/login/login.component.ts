import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ILogin } from '../../model/interfaces/userRegister';
import { LoginService } from '../../services/login.service';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { Constant } from '../../constants/constant';

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

  onLogin(){
    this.loginService.loginUser(this.loginObj).subscribe((res:IJsonResponse)=>{
      if(res.result){
        alert("Login success")
        localStorage.setItem(Constant.LOGIN_TOKEN,res.message);
        localStorage.setItem("UserName",JSON.stringify(res.data));
        this.router.navigateByUrl("/homepage");
      }else{
        alert("Login Failure")
      }
    })
  }

}
