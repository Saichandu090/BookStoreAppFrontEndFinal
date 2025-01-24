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
import { catchError, debounceTime, EMPTY, filter, forkJoin } from 'rxjs';

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
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      forkJoin({
        book: this.bookService.getBookById(Number(bookId)),
        cart: this.cartService.getUserCart()
      }).subscribe({
        next: (results) => {
          if (results.book.status === 200 && results.book.data) {
            this.book = results.book.data;
          }

          if (results.cart.status === 200 && results.cart.data) {
            const cartItem = results.cart.data.find(
              item => item.bookId === this.book.bookId
            );

            if (cartItem) {
              this.cartQuantity = cartItem.cartQuantity;
              this.cartCurrent = cartItem;
            }
          }
        },
        error: (error) => {
          this.snackBar.open('Error loading book or cart', '', { duration: 3000 });
        }
      });
    }
    this.cartService.onCartCalled.pipe(filter(response => response), debounceTime(300)).subscribe(() => this.checkCartStatus());
    this.getWishListBooks();
    this.wishListService.onWishListChanged.subscribe((result: boolean) => {
      if (result) {
        this.getWishListBooks();
      }
    });
  };

  fetchBookDetails(bookId: number): void {
    this.bookService.getBookById(bookId).subscribe({
      next: (response: ResponseStructure<BookResponse>) => {
        if (response.status === 200 && response.data) {
          this.book = response.data;
        }
      },
      error: (err) => {
        console.error('Error fetching book details', err);
      }
    });
  }

  checkCartStatus(): void {
    this.cartService.getUserCart().pipe(
      catchError(() => {
        this.snackBar.open('Error loading the cart', '', { duration: 3000 });
        return EMPTY;
      })
    ).subscribe(response => {
      if (response?.status === 200 && response.data) {
        const cartItem = response.data.find(
          item => item.bookId === this.book.bookId
        );
        this.cartQuantity = cartItem ? cartItem.cartQuantity : 0;
        this.cartCurrent = cartItem || null;
      }
    });
  };

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
      error: (error: ResponseStructure<WishListResponse>) => {
        this.snackBar.open(error.message, '', { duration: 3000 });
      }
    });
  }

  wishListBooks: WishListResponse[] = [];

  getWishListBooks(): void {
    this.wishListService.getWishList().subscribe({
      next: (response: ResponseStructure<WishListResponse[]>) => {
        if (response.status === 200 && response.data) {
          this.wishListBooks = response.data;
        }
      }
    });
  };

  isBookPresent(id: number): boolean {
    const index = this.wishListBooks.findIndex(item => item.bookId === id);
    return index != -1;
  };
}
