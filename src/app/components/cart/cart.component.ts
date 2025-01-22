import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CartD, CartResponse } from '../../model/interfaces/cart';
import { CartService } from '../../services/cart/cart.service';
import { BookResponse, IJsonResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BooksService } from '../../services/books/books.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cart } from '../../model/classes/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  isPopUpOpen: boolean = true;

  cartData: CartD[] = [];

  cartService: CartService = inject(CartService);

  bookService: BooksService = inject(BooksService);

  private snackbar = inject(MatSnackBar);

  showCartPopUp() {
    this.isPopUpOpen = !this.isPopUpOpen
  }

  totalQuantity: number = 0;
  totalPrice: number = 0;

  updateTotals(): void {
    this.totalPrice = 0;
    this.totalQuantity = 0;
    this.cartData.forEach(cart => {
      this.totalPrice += cart.totalPrice,
        this.totalQuantity += cart.quantity
    });
  };

  loadCart(cartResponse: CartResponse[]):void {
    cartResponse.sort((a, b) => a.cartId - b.cartId);
    cartResponse.forEach(item => {
      const existingCartItem = this.cartData.find(cart => cart.cartId === item.cartId);

      if (existingCartItem?.quantity) {
        existingCartItem.quantity = item.cartQuantity;
        existingCartItem.totalPrice = item.cartQuantity * existingCartItem.bookPrice;
        this.updateTotals();

      } else {
        this.bookService.getBookById(item.bookId).subscribe({
          next: (response: ResponseStructure<BookResponse>) => {
            if (response.status === 200 && response.data) {
              const newCart = new CartD();
              newCart.cartId = item.cartId;
              newCart.bookPrice = response.data.bookPrice;
              newCart.quantity = item.cartQuantity;
              newCart.bookName = response.data.bookName;
              newCart.bookId = response.data.bookId;
              newCart.bookLogo = response.data.bookLogo;
              newCart.totalPrice = item.cartQuantity * response.data.bookPrice;
              this.cartData.push(newCart);
              this.updateTotals();
            }
          },
          error: (error: ResponseStructure<BookResponse>) => {
            this.snackbar.open(error.message);
          }
        });
      }
    });
  };

  getCartItems() {
    this.cartService.getUserCart().subscribe({
      next: (response: ResponseStructure<CartResponse[]>) => {
        if (response.status === 200 && response.data) {
          this.loadCart(response.data);
        }
      },
      error: (error: ResponseStructure<CartResponse[]>) => {
        this.snackbar.open(error.message, '', { duration: 3000 });
      }
    })
  };


  onRemoveFromCart(cartId: number): void {
    const cartItem = this.cartData.find(item => item.cartId === cartId);
    if (cartItem) {
    if (cartItem.quantity === 1) {
      const index = this.cartData.indexOf(cartItem);
      if (index !== -1) {
        this.cartData.splice(index, 1);
        this.updateTotals();
      }
    }
  }

    this.cartService.removeBookFromCart(cartId).subscribe({
      next: (response: ResponseStructure<CartResponse>) => {
        if (response.status === 200) {
          this.snackbar.open(response.message, '', { duration: 3000 });
          this.cartService.onCartCalled.next(true);
          this.bookService.onBookChanged.next(true);
        }
      },
      error:(error:ResponseStructure<CartResponse>)=>{
        this.snackbar.open(error.message,'',{duration:3000});
      }
    })
  };



  private cartObj: Cart = new Cart();

  onAddToCart(bookId: number): void {
    this.cartObj.bookId = bookId;
    this.cartService.addBookToCart(this.cartObj).subscribe({
      next: (response: ResponseStructure<CartResponse>) => {
        if (response.status === 200) {
          this.snackbar.open(response.message, '', { duration: 3000 });
          this.cartService.onCartCalled.next(true);
        }
        else if (response.status === 209) {
          this.snackbar.open(response.message, '', { duration: 3000 });
        }
      },
      error: (error: ResponseStructure<CartResponse>) => {
        this.snackbar.open(error.message, '', { duration: 3000 });
      }
    })
  }

  ngOnInit(): void {
    this.getCartItems();
    this.cartService.onCartCalled.subscribe((res: boolean) => {
      if (res) {
        this.getCartItems();
      }
    })
  };
}
