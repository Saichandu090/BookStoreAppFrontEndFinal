import { Component, ElementRef, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { IBookResponse } from '../../model/interfaces/books';
import { BooksService } from '../../services/books/books.service';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { map, Observable, Subscription } from 'rxjs';
import { LoggedInUser } from '../../model/classes/user';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../model/classes/book';
import { Cart, WishListReq } from '../../model/classes/cart';
import { CartService } from '../../services/cart/cart.service';
import { ICart } from '../../model/interfaces/cart';
import { WishlistService } from '../../services/wishList/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [ButtonModule, CommonModule, ReactiveFormsModule,MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  @ViewChild("editBook") editBook!: ElementRef;

  bookList: IBookResponse[] = [];

  private bookService: BooksService = inject(BooksService);

  private snackBar = inject(MatSnackBar);

  sortByBookNameASC(){
    this.subscriptionList.push(this.bookService.sortByBookNameASC().subscribe((res: IJsonResponse) => {
      this.bookList = res.data;
    }));
  }

  sortByPriceASC(){
    this.subscriptionList.push(this.bookService.sortByBookPriceASC().subscribe((res: IJsonResponse) => {
      this.bookList = res.data;
    }));
  }

  getAllBooks() {
    this.subscriptionList.push(this.bookService.getAllBooks().subscribe((res: IJsonResponse) => {
      this.bookList = res.data;
    }));
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

  onEditBook(id: number) {
    if (this.editBook) {
      this.editableBook = id;
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

  toaster = inject(ToastrService);

  subscriptionList: Subscription[] = [];

  onDeleteBook(id: number) {
    const rs = confirm("Do you want to delete this book ?");
    if (rs) {
      this.bookService.deleteBook(id).subscribe((res: IJsonResponse) => {
        if (res.result) {
          this.snackBar.open(res.message, 'Undo', { duration: 3000 });
          this.bookService.onBookChanged.next(true);
        } else {
          this.toaster.error(res.message)
        }
      })
    }
  }

  updatableBook: Book = new Book();
  editableBook!: number;

  fb: FormBuilder = inject(FormBuilder);

  bookForm = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]{3,}$")]),
    author: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]{5,}$")]),
    description: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]{5,}$")]),
    price: new FormControl(0, [Validators.required, Validators.pattern("^[0-9.]+$")]),
    quantity: new FormControl(0, [Validators.required, Validators.min(16)]),
    bookLogo: new FormControl('', [Validators.required])
  })



  getBookById() {
    this.bookService.getBookById(this.editableBook).subscribe({
      next: (res: IJsonResponse) => {
        if (res.result) {
          console.log(res.data)
          this.updatableBook = res.data[0];
          console.log(this.updatableBook);

          this.bookForm.patchValue({
            name: this.updatableBook.name,
            author: this.updatableBook.author,
            description: this.updatableBook.description,
            price: this.updatableBook.price,
            quantity: this.updatableBook.quantity,
            bookLogo: this.updatableBook.bookLogo
          });

        } else {
          this.toaster.error(res.message)
        }
      }
    })
  }

  onUpdateBook() {
    this.updatableBook = Object.assign(new Book(), this.bookForm.value);
    console.log(this.updatableBook)
    this.bookService.updateBook(this.editableBook, this.updatableBook).subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.snackBar.open(res.message, 'Undo', { duration: 3000 });
        this.bookService.onBookChanged.next(true);
        this.onEditClose();
        this.editableBook = 0;
        this.updatableBook = new Book();
      } else {
        console.log(this.updatableBook)
        this.toaster.error(res.message);
      }
    })
  }

  //=========================================//

  cartObj: Cart = new Cart();

  cartRes: ICart = {
    cartId: 0,
    userId: 0,
    bookLogo: '',
    bookName: '',
    quantity: 0,
    totalPrice: 0
  }

  cartService: CartService = inject(CartService);

  onAddToCart(id: number) {
    this.cartObj.bookId = id;
    this.cartService.addToCart(this.cartObj).subscribe({
      next: (res: IJsonResponse) => {
        if (res.result) {
          this.cartRes = res.data[0];
          this.snackBar.open(res.message, 'Undo', { duration: 3000 });
          //this.bookService.onBookChanged.next(true);
          this.cartService.onCartCalled.next(true);
        } else {
          this.toaster.error(res.message)
        }
      },
      error: (err) => {
        console.error("Error from backend:", err);
        const message = err.error?.message || "Something went wrong!";
        this.toaster.error(message);
      }
    }
    )
  }



  //==================================//

  wishListService: WishlistService = inject(WishlistService);

  wishList: WishListReq = new WishListReq();

  wishListBooks: IBookResponse[] = [];

  onWishListClick(book: IBookResponse) {
    this.wishList.bookId = book.bookId;

    this.wishListService.isInWishList(book.bookId).subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.removeFromWishList(book.bookId);
      } else {
        this.addToWishList(this.wishList);
      }
    })
  }// end of onWishListClick


  removeFromWishList(bookId: number) {
    this.wishListService.removeFromWishList(bookId).subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.snackBar.open(res.message, 'Undo', { duration: 3000 });
        this.wishListService.onWishListChanged.next(true);
      }
    })
  }// end of removeFromWishList


  addToWishList(wishList: WishListReq) {
    this.wishListService.addToWishList(wishList).subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.snackBar.open(res.message, 'Undo', { duration: 3000 });
        this.wishListService.onWishListChanged.next(true);
      }
    })
  } // end of addToWishList


  getWishListBooks() {
    this.wishListService.getWishList().subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.wishListBooks = res.data
        console.log(this.wishListBooks)
      }
    })
  } // end of getWishListBooks


  ngOnInit(): void {
    this.getAllBooks();
    this.getCurrentUser();
    this.getWishListBooks();
    this.bookService.onBookChanged.subscribe((res: boolean) => {
      if (res) {
        this.getAllBooks();
      }
    });
    this.wishListService.onWishListChanged.subscribe((res: boolean) => {
      if (res) {
        this.getWishListBooks();
      }
    })
  } // end of ngOnInit


  isBookPresent(id: number): boolean {
    const index = this.wishListBooks.findIndex(item => item.bookId === id);
    return index != -1;
  }

}
