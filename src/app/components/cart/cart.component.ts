import { Component, inject, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ICart } from '../../model/interfaces/cart';
import { CartService } from '../../services/cart/cart.service';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BooksService } from '../../services/books/books.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule,CommonModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{

  isPopUpOpen: boolean = true;

  showCartPopUp() {
    this.isPopUpOpen = !this.isPopUpOpen
  }

  cartData: ICart[] = [];
  
    cartService: CartService = inject(CartService);

    bookService:BooksService=inject(BooksService);

    private snackbar=inject(MatSnackBar);

    cartObj: ICart = {
      userId: 0,
      cartId: 0,
      bookName: '',
      quantity: 0,
      bookLogo: '',
      totalPrice: 0
    }
  
  
    getCartItems() {
      this.cartService.getUserCart().subscribe((res: IJsonResponse) => {
        if (res.result) {
          this.cartData = res.data;
        }
      })
    }

    getCart(cartId: number) {
      this.cartService.getUserCartById(cartId).subscribe((res: IJsonResponse) => {
        if (res.result) {
          this.cartObj = res.data[0]
          console.log(this.cartObj)
        }
      })
    }

    onRemoveProduct(cartId: number) {
      const rs = confirm("Do you want to remove this item from the cart ?");
      if (rs) {
        this.getCart(cartId);
        this.cartService.removeCart(cartId).subscribe((res: IJsonResponse) => {
          if (res.result) {
            this.snackbar.open(res.message,'',{duration:3000})
            this.cartService.onCartCalled.next(true);
            this.bookService.onBookChanged.next(true);
          }
        })
      }
    }

    ngOnInit(): void {
        this.getCartItems();
        this.cartService.onCartCalled.subscribe((res:boolean)=>{
          if(res){
            this.getCartItems();
          }
        })
    }

    
}
