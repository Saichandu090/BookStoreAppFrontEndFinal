import { Component, inject, OnInit } from '@angular/core';
import { IBookResponse } from '../../model/interfaces/books';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { WishlistService } from '../../services/wishList/wishlist.service';
import { CommonModule } from '@angular/common';
import { Cart, WishListReq } from '../../model/classes/cart';
import { ICart } from '../../model/interfaces/cart';
import { CartService } from '../../services/cart/cart.service';
import { BooksService } from '../../services/books/books.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {

  wishListBooks: IBookResponse[] = [];

  bookService: BooksService = inject(BooksService);

  snackbar: MatSnackBar = inject(MatSnackBar);
  //toaster: ToastrService = inject(ToastrService);

  wishListService: WishlistService = inject(WishlistService);

  getWishListBooks() {
    this.wishListService.getWishList().subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.wishListBooks = res.data
        console.log(this.wishListBooks)
      }
    })
  } // end of getWishListBooks

  isBookPresent(id: number): boolean {
    const index = this.wishListBooks.findIndex(item => item.bookId === id);
    if (index != -1)
      return true;
    else
      return false;
  }

  wishList: WishListReq = new WishListReq();

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
        this.snackbar.open(res.message, '', { duration: 3000 });
        this.wishListService.onWishListChanged.next(true);
      }
    })
  }// end of removeFromWishList


  addToWishList(wishList: WishListReq) {
    this.wishListService.addToWishList(wishList).subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.snackbar.open(res.message, '', { duration: 3000 });
        this.wishListService.onWishListChanged.next(true);
      }
    })
  } // end of addToWishList


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
          this.snackbar.open(res.message, '', { duration: 3000 });
          this.bookService.onBookChanged.next(true);
          this.cartService.onCartCalled.next(true);
        } else {
          this.snackbar.open(res.message, '', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error("Error from backend:", err);
        const message = err.error?.message || "Something went wrong!";
        this.snackbar.open(message, '', { duration: 3000 });
      }
    }
    )
  }// end of onAddToCart

  ngOnInit(): void {
    this.getWishListBooks();

    this.wishListService.onWishListChanged.subscribe((res: boolean) => {
      if (res) {
        this.getWishListBooks();
      }
    })
  }
}
