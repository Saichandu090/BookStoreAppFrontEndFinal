import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Constant } from '../../constants/constant';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet,FormsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit
{
  userEmail:string='';

  router=inject(Router);

  getUserMail(){
    const userName=localStorage.getItem("UserName");
    if(userName!=null){
      const name=JSON.parse(userName);
      this.userEmail=name;
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
