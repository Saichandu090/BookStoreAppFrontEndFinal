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
import { Cart } from '../../model/classes/cart';
import { CartService } from '../../services/cart/cart.service';
import { ICart } from '../../model/interfaces/cart';

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
      this.getBookById();
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

  updatableBook:Book=new Book();
  editableBook!:number;

  fb:FormBuilder=inject(FormBuilder);
  
    bookForm=this.fb.group({
      name:new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z ]{3,}$")]),
      author:new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z ]{5,}$")]),
      description:new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z ]{5,}$")]),
      price:new FormControl(0,[Validators.required,Validators.pattern("^[0-9.]+$")]),
      quantity:new FormControl(0,[Validators.required,Validators.min(16)]),
      bookLogo:new FormControl('',[Validators.required])
    })
  
   

    getBookById(){
      this.bookService.getBookById(this.editableBook).subscribe((res:IJsonResponse)=>{
        if(res.result){
          console.log(res.data)
          this.updatableBook=res.data[0];
          console.log(this.updatableBook);

          this.bookForm.patchValue({
            name:this.updatableBook.name,
            author:this.updatableBook.author,
            description:this.updatableBook.description,
            price:this.updatableBook.price,
            quantity:this.updatableBook.quantity,
            bookLogo:this.updatableBook.bookLogo
          });

        }else{
          this.toaster.error(res.message)
        }
      })
    }

    onUpdateBook(){
      this.updatableBook = Object.assign(new Book(), this.bookForm.value);
      console.log(this.updatableBook)
      this.bookService.updateBook(this.editableBook,this.updatableBook).subscribe((res:IJsonResponse)=>{
        if(res.result){
          this.toaster.success(res.message);
          this.bookService.onBookChanged.next(true);
          this.onEditClose();
          this.editableBook=0;
          this.updatableBook=new Book();
        }else{
          console.log(this.updatableBook)
          this.toaster.error(res.message);
        }
      })
    }

    //=========================================//

    cartObj:Cart=new Cart();

    cartRes:ICart={
      cartId:0,
      userId:0,
      bookLogo:'',
      bookName:'',
      quantity:0,
      totalPrice:0
    }

    cartService:CartService=inject(CartService);

    onAddToCart(id:number){
      this.cartObj.bookId=id;
      this.cartService.addToCart(this.cartObj).subscribe((res:IJsonResponse)=>{
        if(res.result){
          this.cartRes=res.data[0];
          //this.cartService.cartTotalPrice += this.cartRes.totalPrice;
          //this.cartService.cartTotalQuantity += this.cartRes.quantity;
          this.toaster.success(res.message);
          this.bookService.onBookChanged.next(true);
          this.cartService.onCartCalled.next(true);
        }else{
          this.toaster.error(res.message)
        }
      })
    }
}
