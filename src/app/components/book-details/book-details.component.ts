import { Component, inject } from '@angular/core';
import { BookResponse, ResponseStructure, WishListResponse } from '../../model/interfaces/jsonresponse';
import { ActivatedRoute } from '@angular/router';
import { BooksService } from '../../services/books/books.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Cart, WishListRequest } from '../../model/classes/cart';
import { CartService } from '../../services/cart/cart.service';
import { WishlistService } from '../../services/wishList/wishlist.service';
import { CartResponse } from '../../model/interfaces/cart';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatButtonModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {

  book!: BookResponse;
  quantity: number = 1;
  isInWishlist: boolean = false;
  isInCart: boolean = false;
  cartObject: Cart = new Cart();
  cartService: CartService = inject(CartService);
  wishListService: WishlistService = inject(WishlistService);
  snackBar: MatSnackBar = inject(MatSnackBar);
  route: ActivatedRoute = inject(ActivatedRoute);
  bookService: BooksService = inject(BooksService);
  cartCurrent: CartResponse | null = null;
  cartQuantity: number = 0;

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.updateCurrentBook(bookId);
    this.updateCurrentCart(bookId);
    this.cartService.onCartCalled.subscribe({
      next: (response: boolean) => {
        if (response) {
          this.updateCurrentCart(bookId);
        }
      }
    });
    this.getWishListBooks();
    this.wishListService.onWishListChanged.subscribe((result: boolean) => {
      if (result) {
        this.getWishListBooks();
      }
    });
  };

  updateCurrentBook(bookId: number) {
    this.bookService.getBookById(bookId).subscribe({
      next: (response: ResponseStructure<BookResponse>) => {
        if (response.status === 200 && response.data) {
          this.book = response.data;
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message || 'Failed to fetch the book';
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };


  updateCurrentCart(bookId: number): void {
    this.cartService.getUserCart().subscribe({
      next: (response: ResponseStructure<CartResponse[]>) => {
        if (response === null) {
          this.cartQuantity = 0;
          return;
        } else if (response.status === 200 && response.data) {
          const cartItem = response.data.find(item => item.bookId === bookId);
          if (cartItem) {
            this.cartCurrent = cartItem;
            this.cartQuantity = cartItem.cartQuantity;
          } else {
            this.cartQuantity = 0;
            this.cartCurrent = null;
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  }

  addToCart(bookId?: number): void {
    if (bookId)
      this.cartObject.bookId = bookId;
    this.cartService.addBookToCart(this.cartObject).subscribe({
      next: (response: ResponseStructure<CartResponse>) => {
        if (response.status === 200 && response.data) {
          this.snackBar.open(response.message, '', { duration: 3000 });
          this.cartService.onCartCalled.next(true);
        }
        else if (response.status === 209) {
          this.snackBar.open(response.message);
        }
      },
      error: (error: ResponseStructure<CartResponse>) => {
        this.snackBar.open(error.message, '', { duration: 3000 });
      }
    });
  };

  onRemoveFromCart(cartId?: number): void {
    if (cartId)
      this.cartService.removeBookFromCart(cartId).subscribe({
        next: (response: ResponseStructure<CartResponse>) => {
          if (response.status === 200) {
            this.snackBar.open(response.message, '', { duration: 3000 });
            this.cartService.onCartCalled.next(true);
          }
        },
        error: (error: ResponseStructure<CartResponse>) => {
          this.snackBar.open(error.message, '', { duration: 3000 });
        }
      });
  };

  wishListObj: WishListRequest = new WishListRequest();

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
        const errorMessage = error.error?.message || error.message || 'Failed to add book to wishlist';
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  }

  wishListBooks: WishListResponse[] = [];

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
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };

  isBookPresent(id: number): boolean {
    return this.wishListBooks.some(book => book.bookId === id);
  };
}
