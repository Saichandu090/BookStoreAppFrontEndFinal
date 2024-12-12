import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Constant } from './constants/constant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  userEmail:string='';

  router=inject(Router);

  getUserMail(){
    const userName=localStorage.getItem("UserName");
    if(userName!=null){
      this.userEmail=userName;
    }
  }

  ngOnInit(): void {
    this.getUserMail();
  }

  onLogOut(){
    localStorage.removeItem(Constant.LOGIN_TOKEN);
    localStorage.removeItem("UserName");
    this.router.navigateByUrl("/login");
  }
  
}
