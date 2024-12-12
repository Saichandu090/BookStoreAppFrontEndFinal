import { Component, ElementRef, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { IBookResponse } from '../../model/interfaces/books';
import { BooksService } from '../../services/books/books.service';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoggedInUser } from '../../model/classes/user';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../model/classes/book';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [ButtonModule, CommonModule,ReactiveFormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  @ViewChild("editBook") editBook!: ElementRef;

  bookList: IBookResponse[] = [];

  private bookService = inject(BooksService);

  getAllBooks() {
    this.subscriptionList.push(this.bookService.getAllBooks().subscribe((res: IJsonResponse) => {
      this.bookList = res.data;
    }));
  }

  ngOnInit(): void {
    this.getAllBooks();
    this.getCurrentUser();
    this.bookService.onBookChanged.subscribe((res: boolean) => {
      if (res) {
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

  //======================================//

  onEditBook(id:number) {
    if (this.editBook) {
      this.editableBook=id;
      this.editBook.nativeElement.style.display = "block";
    }
  }

  onEditClose() {
    if (this.editBook) {
      this.editBook.nativeElement.style.display = "none";
    }
  }

  //======================================//

  toaster=inject(ToastrService);

  subscriptionList: Subscription[] = [];

  onDeleteBook(id:number){
    const rs=confirm("Do you want to delete this book ?");
    if(rs){
      this.bookService.deleteBook(id).subscribe((res:IJsonResponse)=>{
        if(res.result){
          this.toaster.success(res.message);
          this.bookService.onBookChanged.next(true);
        }else{
          this.toaster.error(res.message)
        }
      })
    }
  }



  fb:FormBuilder=inject(FormBuilder);
  
    bookForm=this.fb.group({
      name:new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z ]{3,}$")]),
      author:new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z ]{5,}$")]),
      description:new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z ]{5,}$")]),
      price:new FormControl('',[Validators.required,Validators.pattern("^[0-9.]+$")]),
      quantity:new FormControl('',[Validators.required,Validators.min(16)]),
      bookLogo:new FormControl('',[Validators.required])
    })

  
    editableBook!:number;
    updatableBook:Book=new Book();

    onUpdateBook(){
      this.updatableBook = Object.assign(new Book(), this.bookForm.value);
      this.bookService.updateBook(this.editableBook,this.updatableBook).subscribe((res:IJsonResponse)=>{
        if(res.result){
          this.toaster.success(res.message)
          this.bookService.onBookChanged.next(true);
          this.onEditClose()
          this.editableBook=0
          this.updatableBook=new Book()
        }else{
          this.toaster.error(res.message);
        }
      })
    }
}
