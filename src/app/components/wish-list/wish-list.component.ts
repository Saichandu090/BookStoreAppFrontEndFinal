import { WishListResponse } from './../../model/interfaces/jsonresponse';
import { WishListReq } from './../../model/classes/cart';
import { Component, inject, OnInit } from '@angular/core';
import { BookResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { WishlistService } from '../../services/wishList/wishlist.service';
import { CommonModule } from '@angular/common';
import { Cart } from '../../model/classes/cart';
import { CartResponse } from '../../model/interfaces/cart';
import { CartService } from '../../services/cart/cart.service';
import { BooksService } from '../../services/books/books.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {

  wishListBooks: WishListResponse[] = [];

  books: BookResponse[] = [];

  private snackBar: MatSnackBar = inject(MatSnackBar);

  bookService: BooksService = inject(BooksService);

  snackbar: MatSnackBar = inject(MatSnackBar);

  wishListService: WishlistService = inject(WishlistService);

  wishListObj: WishListReq = new WishListReq();

  getWishListBooks():void {
    this.wishListService.getWishList().subscribe({
      next: (response: ResponseStructure<WishListResponse[]>) => {
        if (response.status === 200 && response.data) {
          this.wishListBooks = [];
          this.wishListBooks = response.data;
          this.getBooks(this.wishListBooks);
        }
      }
    })
  }; // end of getWishListBooks


  getBooks(wishList: WishListResponse[]): void {
    const sortedWishList = wishList.sort((a,b)=>a.wishListId-b.wishListId);
    sortedWishList.forEach(item => this.bookService.getBookById(item.bookId).subscribe({
      next: (response: ResponseStructure<BookResponse>) => {
        if (response.status === 200 && response.data) {
          this.books.push(response.data);
        }
      }
    }))
  };

  isBookPresent(id: number): boolean {
    const index = this.wishListBooks.findIndex(item => item.bookId === id);
    if (index != -1)
      return true;
    else
      return false;
  };


  addToWishList(bookId: number):void {
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
    })
  }; // end of addToWishList


  cartObj: Cart = new Cart();

  cartService: CartService = inject(CartService);

  onAddToCart(id: number):void {
    this.cartObj.bookId = id;
    this.cartService.addBookToCart(this.cartObj).subscribe({
      next: (res: ResponseStructure<CartResponse>) => {
        if (res.status === 200) {
          this.snackbar.open(res.message, '', { duration: 3000 });
          this.bookService.onBookChanged.next(true);
          this.cartService.onCartCalled.next(true);
        }
      },
      error: (error: ResponseStructure<CartResponse>) => {
        this.snackbar.open(error.message, '', { duration: 3000 });
      }
    }
    )
  };// end of onAddToCart


  ngOnInit(): void {
    this.getWishListBooks();
    this.wishListService.onWishListChanged.subscribe((res: boolean) => {
      if (res) {
        this.books = [];
        this.getWishListBooks();
      }
    })
  };
}
