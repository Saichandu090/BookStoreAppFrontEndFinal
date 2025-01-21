import { WishListResponse } from './../../model/interfaces/jsonresponse';
import { WishListReq } from './../../model/classes/cart';
import { Component, inject, OnInit } from '@angular/core';
import { IBookResponse } from '../../model/interfaces/books';
import { BookResponse, IJsonResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { WishlistService } from '../../services/wishList/wishlist.service';
import { CommonModule } from '@angular/common';
import { Cart } from '../../model/classes/cart';
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

  wishListBooks: WishListResponse[] = [];

  books:BookResponse[]=[];

  private snackBar:MatSnackBar=inject(MatSnackBar);

  bookService: BooksService = inject(BooksService);

  snackbar: MatSnackBar = inject(MatSnackBar);
  //toaster: ToastrService = inject(ToastrService);

  wishListService: WishlistService = inject(WishlistService);

  getWishListBooks() {
    this.wishListService.getWishList().subscribe({
      next:(response: ResponseStructure<WishListResponse[]>) => {
        if (response.status===200) {
          this.wishListBooks = response.data;
          this.getBooks(this.wishListBooks);
        }
    }
    })
  }; // end of getWishListBooks

  isBookPresent(id: number): boolean {
    const index = this.wishListBooks.findIndex(item => item.bookId === id);
    if (index != -1)
      return true;
    else
      return false;
  }

  wishList: WishListReq = new WishListReq();

  onWishListClick(bookId: number) {
    this.wishList.bookId=bookId;
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

  getBooks(wishList:WishListResponse[]):void{
    wishList.forEach(item=>this.bookService.getBookById(item.bookId).subscribe({
      next:(response:ResponseStructure<BookResponse>)=>{
        if(response.status===200){
          this.books.push(response.data);
        }
      }
    }))
  }


  removeFromWishList(wishList: WishListReq) {
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


  addToWishList(wishList: WishListReq) {
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
    this.wishListBooks=[];
    this.getWishListBooks();
    this.wishListService.onWishListChanged.subscribe((res: boolean) => {
      if (res) {
        this.wishListBooks=[];
        this.getWishListBooks();
      }
    })
  }
}
