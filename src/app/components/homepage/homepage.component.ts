import { Component, inject, OnInit } from '@angular/core';
import { IBookResponse } from '../../model/interfaces/books';
import { BooksService } from '../../services/books/books.service';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoggedInUser } from '../../model/classes/user';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [ButtonModule,CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit{


  bookList:IBookResponse[]=[];

  private bookService=inject(BooksService);

  getAllBooks(){
    this.subscriptionList.push(this.bookService.getAllBooks().subscribe((res:IJsonResponse)=>{
      this.bookList=res.data;
    }));
  }

  ngOnInit(): void {
      this.getAllBooks();
      this.getCurrentUser();
      this.bookService.onBookAdded.subscribe((res:boolean)=>{
        if(res){
          this.getAllBooks();
        }
      })
  }

  currentUser: LoggedInUser = {
      email: '',
      role: ''
    }
  
    getCurrentUser() {
      const user = localStorage.getItem("UserDetails");
      if (user != null) {
        debugger;
        const parsedUser = JSON.parse(user);
        this.currentUser = parsedUser[0];
        console.log(this.currentUser.email)
        console.log(this.currentUser.role)
      }
    }

    subscriptionList:Subscription[]=[];
}
