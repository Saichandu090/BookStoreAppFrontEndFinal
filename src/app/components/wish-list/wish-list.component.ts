import { WishListResponse } from './../../model/interfaces/jsonresponse';
import { Component, inject, OnInit } from '@angular/core';
import { BookResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { WishlistService } from '../../services/wishList/wishlist.service';
import { CommonModule } from '@angular/common';
import { Cart, WishListRequest } from '../../model/classes/cart';
import { CartResponse } from '../../model/interfaces/cart';
import { CartService } from '../../services/cart/cart.service';
import { BooksService } from '../../services/books/books.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule, MatIconModule,RouterLink],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {

  wishListBooks: WishListResponse[] = [];

  booksInWishList: BookResponse[] = [];

  snackBar: MatSnackBar = inject(MatSnackBar);

  bookService: BooksService = inject(BooksService);

  snackbar: MatSnackBar = inject(MatSnackBar);

  wishListService: WishlistService = inject(WishlistService);

  cartObject: Cart = new Cart();

  cartService: CartService = inject(CartService);

  router: Router = inject(Router);

  wishListObject: WishListRequest = {
    bookId: 0
  };

  continue(): void {
    this.router.navigateByUrl('/homepage');
  }

  getWishListBooks(): void {
    this.wishListService.getWishList().subscribe({
      next: (response: ResponseStructure<WishListResponse[]>) => {
        if (response === null) {
          this.booksInWishList = [];
          this.wishListBooks = [];
          return;
        }
        else if (response.status === 200 && response.data) {
          this.booksInWishList=[];
          this.wishListBooks=response.data;
          this.getBooks(response.data);
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        this.snackbar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };

  getBooks(wishList: WishListResponse[]): void {
    this.booksInWishList = this.booksInWishList.filter(book =>
      wishList.some(wishListItem => wishListItem.bookId === book.bookId)
    );
    wishList.forEach(item => {
      if (!this.booksInWishList.some(book => book.bookId === item.bookId)) {
        this.bookService.getBookById(item.bookId).subscribe({
          next: (response: ResponseStructure<BookResponse>) => {
            if (response.status === 200 && response.data) {
              this.booksInWishList.push(response.data);
            }
          },
          error: (error: HttpErrorResponse) => {
            const errorMessage = error.error?.message || error.message;
            this.snackBar.open(errorMessage, '', { duration: 3000 });
          }
        });
      }
    });
  }

  isBookPresent(id: number): boolean {
    return this.wishListBooks.some(book => book.bookId === id);
  };


  addToWishList(bookId: number): void {
    this.wishListObject.bookId = bookId;
    this.wishListService.addToWishList(this.wishListObject).subscribe({
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


  onAddToCart(id: number): void {
    this.cartObject.bookId = id;
    this.cartService.addBookToCart(this.cartObject).subscribe({
      next: (res: ResponseStructure<CartResponse>) => {
        if (res.status === 200) {
          this.snackbar.open(res.message, '', { duration: 3000 });
          this.bookService.onBookChanged.next(true);
          this.cartService.onCartCalled.next(true);
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };


  ngOnInit(): void {
    this.getWishListBooks();
    this.wishListService.onWishListChanged.subscribe((response: boolean) => {
      if (response) {
        this.getWishListBooks();
      }
    });
  };
}
