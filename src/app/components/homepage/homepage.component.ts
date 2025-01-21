import { Component, ElementRef, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { IBookResponse } from '../../model/interfaces/books';
import { BooksService } from '../../services/books/books.service';
import { BookResponse, IJsonResponse, ResponseStructure, WishListResponse } from '../../model/interfaces/jsonresponse';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { LoggedInUser } from '../../model/classes/user';
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
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [ButtonModule, CommonModule, ReactiveFormsModule, MatButtonModule, MatMenuModule, MatIconModule, MatPaginatorModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  currentUser: LoggedInUser = {
    email: '',
    role: ''
  }

  @ViewChild("editBook") editBook!: ElementRef;

  bookList: BookResponse[] = [];

  private bookService: BooksService = inject(BooksService);

  private snackBar = inject(MatSnackBar);

  updatableBook: Book = new Book();
  editableBook!: number;

  fb: FormBuilder = inject(FormBuilder);

  sortByBookNameASC(): void {

  }

  sortByPriceASC(): void {

  }


  getAllBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (response: ResponseStructure<BookResponse[]>) => {
        if (response === null) {
          this.snackBar.open("No Books Available at the store", '', { duration: 3000 });
          this.bookList = [];
        }
        else if (response.status === 200) {
          this.bookList = response.data;
        }
      },
      error: (error: ResponseStructure<BookResponse[]>) => {
        console.log("error", error)
        this.snackBar.open(error.message, '', { duration: 3000 })
      }
    })
  };

  //======================================//

  onEditBook(id: number): void {
    if (this.editBook) {
      this.editableBook = id;
      this.getBookById();
      this.editBook.nativeElement.style.display = "block";
    }
  }

  onEditClose(): void {
    if (this.editBook) {
      this.editBook.nativeElement.style.display = "none";
    }
  }

  //======================================//



  onDeleteBook(bookId: number): void {
    const rs = confirm("Do you want to delete this book ?");
    if (rs) {
      this.bookService.deleteBook(bookId).subscribe({
        next: (response: ResponseStructure<string>) => {
          if (response.status === 200) {
            this.snackBar.open(response.message, '', { duration: 3000 });
            this.bookService.onBookChanged.next(true);
          }
        },
        error: (error: ResponseStructure<string>) => {
          this.snackBar.open(error.message);
        }
      })
    }
  };

  bookForm = this.fb.group({
    bookId: new FormControl('', [Validators.required]),
    bookName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z .',]{3,}$")]),
    bookAuthor: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z .',]{5,}$")]),
    bookDescription: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z .',]{5,}$")]),
    bookPrice: new FormControl(0, [Validators.required, Validators.pattern("^[0-9.]+$")]),
    bookQuantity: new FormControl(0, [Validators.required, Validators.min(16)]),
    bookLogo: new FormControl('', [Validators.required])
  })



  getBookById(): void {
    this.bookService.getBookById(this.editableBook).subscribe({
      next: (response: ResponseStructure<BookResponse>) => {
        if (response.status === 200) {
          this.updatableBook = response.data;
          console.log(this.updatableBook);

          this.bookForm.patchValue({
            bookName: this.updatableBook.bookName,
            bookAuthor: this.updatableBook.bookAuthor,
            bookDescription: this.updatableBook.bookDescription,
            bookPrice: this.updatableBook.bookPrice,
            bookQuantity: this.updatableBook.bookQuantity,
            bookLogo: this.updatableBook.bookLogo
          });
        } else {
          this.snackBar.open(response.message, '', { duration: 3000 })
        }
      }
    })
  }


  onUpdateBook(): void {
    this.updatableBook = Object.assign(new Book(), this.bookForm.value);
    this.updatableBook.bookId = this.editableBook;
    this.bookService.updateBook(this.editableBook, this.updatableBook).subscribe({
      next: (response: ResponseStructure<BookResponse>) => {
        if (response.status === 200) {
          this.snackBar.open(response.message, '', { duration: 3000 });
          this.bookService.onBookChanged.next(true);
          this.onEditClose();
          this.editableBook = 0;
          this.updatableBook = new Book();
        }
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

  onAddToCart(id: number): void {
    this.cartObj.bookId = id;
    this.cartService.addToCart(this.cartObj).subscribe({
      next: (res: IJsonResponse) => {
        if (res.result) {
          this.cartRes = res.data;
          this.snackBar.open(res.message, '', { duration: 3000 });
          this.cartService.onCartCalled.next(true);
        } else {
          this.snackBar.open(res.message, '', { duration: 3000 })
        }
      },
      error: (err) => {
        console.error("Error from backend:", err);
        const message = err.error?.message || "Something went wrong!";
        this.snackBar.open(message, '', { duration: 3000 });
      }
    }
    )
  }

  //==================================//

  wishListService: WishlistService = inject(WishlistService);

  wishList: WishListReq = new WishListReq();

  wishListBooks: WishListResponse[] = [];

  onWishListClick(bookId: number): void {
    this.wishList.bookId = bookId;
    this.wishListService.isInWishList(bookId).subscribe({
      next: (response: ResponseStructure<Boolean>) => {
        if (response.data) {
          this.removeFromWishList(this.wishList);
        } else {
          this.addToWishList(this.wishList);
        }
      }
    })
  }// end of onWishListClick


  removeFromWishList(wishList: WishListReq): void {
    this.wishListService.addToWishList(wishList).subscribe({
      next: (response: ResponseStructure<WishListResponse>) => {
        if (response.status===200) {
          this.snackBar.open(response.message, '', { duration: 3000 });
          this.wishListService.onWishListChanged.next(true);
        }
      },
      error:(error:ResponseStructure<WishListResponse>)=>{
        this.snackBar.open(error.message,'',{duration:3000});
      }
    })
  }// end of removeFromWishList


  addToWishList(wishList: WishListReq): void {
    this.wishListService.addToWishList(wishList).subscribe({
      next: (response: ResponseStructure<WishListResponse>) => {
        if (response.status === 201) {
          this.snackBar.open(response.message, '', { duration: 3000 });
          this.wishListService.onWishListChanged.next(true);
        }
      },
      error: (error: ResponseStructure<WishListResponse>) => {
        this.snackBar.open(error.message, '', { duration: 3000 });
      }
    })
  } // end of addToWishList


  getWishListBooks(): void {
    this.wishListService.getWishList().subscribe({
      next:(response: ResponseStructure<WishListResponse[]>) => {
        if (response.status===200) {
          this.wishListBooks = response.data
          console.log(this.wishListBooks)
        }
    }
    })
  }; // end of getWishListBooks


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

  getCurrentUser(): void {
    const user = localStorage.getItem("UserDetails");
    if (user != null) {
      debugger;
      const parsedUser = JSON.parse(user);
      this.currentUser = parsedUser;
      console.log(this.currentUser.email)
      console.log(this.currentUser.role)
    }
  }
}
