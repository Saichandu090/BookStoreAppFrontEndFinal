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

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CommonModule],
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

  wishListObject: WishListRequest={
    bookId:0
  };

  getWishListBooks():void {
    this.wishListService.getWishList().subscribe({
      next: (response: ResponseStructure<WishListResponse[]>) => {
        if (response.status === 200 && response.data) {
          this.booksInWishList=[];
          this.wishListBooks = response.data;
          this.getBooks(this.wishListBooks);
        }
      }
    });
  }; // end of getWishListBooks


  getBooks(wishList: WishListResponse[]): void {
    const sortedWishList = wishList.sort((a,b)=>a.bookId-b.bookId);
    sortedWishList.forEach(item=>{
      const wishListBook=this.booksInWishList.find(book=>book.bookId===item.bookId);
      if(!wishListBook){
       this.bookService.getBookById(item.bookId).subscribe({
        next:(response:ResponseStructure<BookResponse>)=>{
          if(response.status===200 && response.data){
            this.booksInWishList.push(response.data);
          }
        },
        error:(error:ResponseStructure<BookResponse>)=>{
          this.snackBar.open(error.message,'',{duration:3000});
        }
       });
      }
    });
  };

  isBookPresent(id: number): boolean {
    const index = this.wishListBooks.findIndex(item => item.bookId === id);
    if (index != -1)
      return true;
    else
      return false;
  };


  addToWishList(bookId: number):void {
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
      error: (error: ResponseStructure<WishListResponse>) => {
        this.snackBar.open(error.message, '', { duration: 3000 });
      }
    });
  }; // end of addToWishList


  cartObject: Cart = new Cart();

  cartService: CartService = inject(CartService);

  onAddToCart(id: number):void {
    this.cartObject.bookId = id;
    this.cartService.addBookToCart(this.cartObject).subscribe({
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
    });
  };// end of onAddToCart


  ngOnInit(): void {
    this.getWishListBooks();
    this.wishListService.onWishListChanged.subscribe((response: boolean) => {
      if (response) {
        this.getWishListBooks();
      }
    });
  };
}
