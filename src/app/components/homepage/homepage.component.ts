import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { BooksService } from '../../services/books/books.service';
import { BookResponse, ResponseStructure, WishListResponse } from '../../model/interfaces/jsonresponse';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { LoggedInUser } from '../../model/classes/user';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../model/classes/book';
import { Cart, WishListRequest } from '../../model/classes/cart';
import { CartResponse } from '../../model/interfaces/cart';
import { WishlistService } from '../../services/wishList/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CartService } from '../../services/cart/cart.service';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [ButtonModule, CommonModule, ReactiveFormsModule, MatButtonModule, MatMenuModule, MatIconModule, MatPaginatorModule, RouterLink,FormsModule,MatFormFieldModule],
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

  originalBookList: any[] = [];

  private bookService: BooksService = inject(BooksService);

  private snackBar = inject(MatSnackBar);

  updatableBook: Book = new Book();

  editableBook!: number;

  formBuilder: FormBuilder = inject(FormBuilder);

  cartObject: Cart = new Cart();

  cartService: CartService = inject(CartService);

  wishListService: WishlistService = inject(WishlistService);

  wishListObj: WishListRequest = {
    bookId: 0,
  };

  wishListBooks: WishListResponse[] = [];

  searchQuery: string = '';

  searchBooks() {
    if (!this.searchQuery.trim()) {
      this.bookList = [...this.originalBookList];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.bookList = this.originalBookList.filter(book =>
      book.bookName.toLowerCase().includes(query) ||
      book.bookAuthor.toLowerCase().includes(query) ||
      book.bookDescription.toLowerCase().includes(query)
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.bookList = [...this.originalBookList];
  }

  sortByField(field: string): void {
    this.bookService.sortByField(field).subscribe({
      next: (response: ResponseStructure<BookResponse[]>) => {
        if (response.status === 200 && response.data) {
          this.bookList = response.data;
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };


  getAllBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (response: ResponseStructure<BookResponse[]>) => {
        if (response === null) {
          this.snackBar.open("No Books Available at the store", '', { duration: 3000 });
          this.bookList = [];
        }
        else if (response.status === 200 && response.data) {
          this.bookList = response.data;
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };



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
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error?.message || error.message;
          this.snackBar.open(errorMessage, '', { duration: 3000 });
        }
      });
    }
  };

  bookForm = this.formBuilder.group({
    bookId: new FormControl('', [Validators.required]),
    bookName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z .',]{3,}$")]),
    bookAuthor: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z .',]{5,}$")]),
    bookDescription: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z .',]{5,}$")]),
    bookPrice: new FormControl(0, [Validators.required, Validators.pattern("^[0-9.]+$")]),
    bookQuantity: new FormControl(0, [Validators.required, Validators.min(16)]),
    bookLogo: new FormControl('', [Validators.required])
  });



  getBookById(): void {
    this.bookService.getBookById(this.editableBook).subscribe({
      next: (response: ResponseStructure<BookResponse>) => {
        if (response.status === 200 && response.data) {
          this.updatableBook = response.data;

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
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };


  onUpdateBook(): void {
    this.updatableBook = Object.assign(new Book(), this.bookForm.value);
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
    });
  };


  onAddToCart(id: number): void {
    this.cartObject.bookId = id;
    this.cartService.addBookToCart(this.cartObject).subscribe({
      next: (response: ResponseStructure<CartResponse>) => {
        if (response.status === 200) {
          this.snackBar.open(response.message, '', { duration: 3000 });
          this.cartService.onCartCalled.next(true);
        }
        else if (response.status === 209) {
          this.snackBar.open(response.message);
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };



  addToWishList(bookId: number): void {
    this.wishListObj.bookId = bookId;
    this.wishListService.addToWishList(this.wishListObj).subscribe({
      next: (response: ResponseStructure<WishListResponse>) => {
        if (response.status === 201) {
          this.snackBar.open(response.message, '', { duration: 3000 });
          this.wishListService.onWishListChanged.next(true);
        }
        else if (response.status === 200) {
          this.snackBar.open(response.message, '', { duration: 3000 });
          this.wishListService.onWishListChanged.next(true);
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };


  getWishListBooks(): void {
    this.wishListService.getWishList().subscribe({
      next: (response: ResponseStructure<WishListResponse[]>) => {
        if (response === null) {
          this.wishListBooks = [];
          return;
        }
        else if (response.status === 200 && response.data) {
          this.wishListBooks = response.data;
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        if (this.currentUser.role === 'USER')
          this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };


  ngOnInit(): void {
    this.getAllBooks();
    this.getCurrentUser();
    this.getWishListBooks();
    this.bookService.onBookChanged.subscribe((result: boolean) => {
      if (result) {
        this.getAllBooks();
      }
    });
    this.wishListService.onWishListChanged.subscribe((result: boolean) => {
      if (result) {
        this.getWishListBooks();
      }
    });
  };


  isBookPresent(id: number): boolean {
    return this.wishListBooks.some(book => book.bookId === id);
  };

  getCurrentUser(): void {
    const user = localStorage.getItem("UserDetails");
    if (user != null) {
      debugger;
      const parsedUser = JSON.parse(user);
      this.currentUser = parsedUser;
    }
  };
}
