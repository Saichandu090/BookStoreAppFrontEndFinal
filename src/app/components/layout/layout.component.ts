import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { Book } from '../../model/classes/book';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoggedInUser } from '../../model/classes/user';
import { ToastrService } from 'ngx-toastr';
import { BooksService } from '../../services/books/books.service';
import { LoginService } from '../../services/login/login.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, FormsModule, RouterOutlet,ReactiveFormsModule,ButtonModule,ConfirmPopupModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{

  @ViewChild("addBook") addBook: ElementRef | undefined;

  private loginService = inject(LoginService);

  private bookService=inject(BooksService);

  //=========================================//

  constructor(private toastr: ToastrService) {
  }

  currentUser: LoggedInUser =new LoggedInUser();

  getCurrentUser() {
    const user = localStorage.getItem("UserDetails");
    if (user != null) {
      debugger;
      const pardedUser = JSON.parse(user);
      this.currentUser = pardedUser[0];
      console.log(this.currentUser.email)
      console.log(this.currentUser.role)
    }
  }


  ngOnInit(): void {
    this.getCurrentUser();
  }


  router: Router = inject(Router);


  onLogOut() {
    const msg=confirm("Do you want to Logout?");
    if(msg){
      this.showSuccess()
      localStorage.removeItem("appToken")
      localStorage.removeItem("UserDetails")
      this.router.navigateByUrl("/login")
    }
  }

  //=====================================//

  isPopUpOpen: boolean = true;

  showCartPopUp() {
    this.isPopUpOpen = !this.isPopUpOpen
  }

  //====================================//

  //cartData:ICart[]=[];

  getCartItems() {

  }

  //=============================================//

  openAddBook() {
    if (this.addBook) {
      this.addBook.nativeElement.style.display = "block"
    }
  }

  closeAddBookModel(){
    if (this.addBook) {
      this.bookForm.reset()
      this.addBook.nativeElement.style.display = "none"
    }
  }

  book:Book=new Book();

  fb:FormBuilder=inject(FormBuilder);

  bookForm=this.fb.group({
    name:new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z ]{3,}$")]),
    author:new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z ]{5,}$")]),
    description:new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z ]{5,}$")]),
    price:new FormControl('',[Validators.required,Validators.pattern("^[0-9.]+$")]),
    quantity:new FormControl('',[Validators.required,Validators.min(16)]),
    bookLogo:new FormControl('',[Validators.required])
  })

  addNewBook(){
    this.book = Object.assign(new Book(), this.bookForm.value);
    console.log(this.book)
    this.bookService.addNewBook(this.book).subscribe((res:IJsonResponse)=>{
      if(res.result){
        console.log(res.message)
        this.toastr.success("Book added Successfully")
        this.bookService.onBookChanged.next(true);
        this.closeAddBookModel();
      }
    })
  }

  subscriptionList:Subscription[]=[];

  //=============================================//

  showSuccess() {
    this.toastr.show('Logout Success');
  }
  
}
