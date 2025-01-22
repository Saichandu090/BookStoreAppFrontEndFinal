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

  loadCart(cartResponse: CartResponse[]) {

    cartResponse.sort((a, b) => a.cartId - b.cartId);
    cartResponse.forEach(item => {
      const existingCartItem = this.cartData.find(cart => cart.cartId === item.cartId);

      if (existingCartItem) {
        existingCartItem.quantity = item.cartQuantity;
        existingCartItem.totalPrice = item.cartQuantity * existingCartItem.bookPrice;

      } else {
        this.bookService.getBookById(item.bookId).subscribe({
          next: (response: ResponseStructure<BookResponse>) => {
            if (response.status === 200) {
              const newCart = new CartD();
              newCart.cartId = item.cartId;
              newCart.bookPrice = response.data.bookPrice;
              newCart.quantity = item.cartQuantity;
              newCart.bookName = response.data.bookName;
              newCart.bookId = response.data.bookId;
              newCart.bookLogo = response.data.bookLogo;
              newCart.totalPrice = item.cartQuantity * response.data.bookPrice;
              this.cartData.push(newCart);
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
        if (response.status === 200) {
          this.loadCart(response.data);
        }
      },
      error: (error: ResponseStructure<CartResponse[]>) => {
        this.snackbar.open(error.message, '', { duration: 3000 });
      }
    })
  };

  getCart(cartId: number) {
    this.cartService.getUserCartById(cartId).subscribe((res: IJsonResponse) => {
      if (res.result) {
        //this.cartObj = res.data[0]
      }
    })
  }

  onRemoveFromCart(bookId: number): void {

  }

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

  onRemoveProduct(cartId: number) {
    const rs = confirm("Do you want to remove this item from the cart ?");
    if (rs) {
      this.getCart(cartId);
      this.cartService.removeBookFromCart(cartId).subscribe((res: IJsonResponse) => {
        if (res.result) {
          this.snackbar.open(res.message, '', { duration: 3000 })
          this.cartService.onCartCalled.next(true);
          this.bookService.onBookChanged.next(true);
        }
      })
    }
  }

  ngOnInit(): void {
    this.getCartItems();
    this.cartService.onCartCalled.subscribe((res: boolean) => {
      if (res) {
        this.getCartItems();
      }
    })
  }


}
