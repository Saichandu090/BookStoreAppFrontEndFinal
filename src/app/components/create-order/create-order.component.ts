import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartData, CartResponse } from '../../model/interfaces/cart';
import { CartService } from '../../services/cart/cart.service';
import { AddressResponse, BookResponse, IJsonResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { AddressService } from '../../services/address/address.service';
import { Address, Cart } from '../../model/classes/cart';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrderRequest, OrderResponse } from '../../model/interfaces/order';
import { OrderService } from '../../services/order/order.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BooksService } from '../../services/books/books.service';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressComponent } from '../add-address/add-address.component';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {

  private cartService: CartService = inject(CartService);

  private snackbar: MatSnackBar = inject(MatSnackBar);

  private bookService = inject(BooksService);

  private snackBar: MatSnackBar = inject(MatSnackBar);

  cartData: CartData[] = [];

  cartObj: Cart = new Cart();

  totalQuantity: number = 0;

  totalPrice: number = 0;

  addressList: AddressResponse[] = [];

  private formBuilder: FormBuilder = inject(FormBuilder);

  private addressService: AddressService = inject(AddressService);

  orderService: OrderService = inject(OrderService);

  router: Router = inject(Router);


  onAddToCart(bookId: number): void {
    this.cartObj.bookId = bookId;
    this.cartService.addBookToCart(this.cartObj).subscribe({
      next: (response: ResponseStructure<CartResponse>) => {
        if (response.status === 200) {
          this.snackBar.open(response.message, '', { duration: 3000 });
          this.cartService.onCartCalled.next(true);
        }
        else if (response.status === 209) {
          this.snackBar.open(response.message, '', { duration: 3000 });
        }
      },
      error: (error: ResponseStructure<CartResponse>) => {
        this.snackBar.open(error.message, '', { duration: 3000 });
      }
    });
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
      error: (error: ResponseStructure<CartResponse>) => {
        this.snackbar.open(error.message, '', { duration: 3000 });
      }
    });
  };

  updateTotals(): void {
    this.totalPrice = 0;
    this.totalQuantity = 0;
    this.cartData.forEach(cart => {
      this.totalPrice += cart.totalPrice,
        this.totalQuantity += cart.quantity
    });
  };

  loadCart(cartResponse: CartResponse[]) {
    if (this.cartData.length === 0) {
      this.totalPrice = 0;
      this.totalQuantity = 0;
    }
    cartResponse.sort((a, b) => a.cartId - b.cartId);
    cartResponse.forEach(item => {
      const existingCartItem = this.cartData.find(cart => cart.cartId === item.cartId);

      if (existingCartItem) {
        existingCartItem.quantity = item.cartQuantity;
        existingCartItem.totalPrice = item.cartQuantity * existingCartItem.bookPrice;
        this.updateTotals();
      } else {
        this.bookService.getBookById(item.bookId).subscribe({
          next: (response: ResponseStructure<BookResponse>) => {
            if (response.status === 200 && response.data) {
              const newCart = new CartData();
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

  getUserCart() {
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
  }; // end of cart methods

  ngOnInit(): void {
    this.getUserCart();
    this.getAllUserAddress();
    this.addressService.onAddressChange.subscribe((result: boolean) => {
      if (result) {
        this.getAllUserAddress();
      }
    });
    this.cartService.onCartCalled.subscribe((result: boolean) => {
      if (result) {
        this.getUserCart();
      }
    });
  };


  getAllUserAddress(): void {
    this.addressService.getAllAddress().subscribe({
      next: (response: ResponseStructure<AddressResponse[]>) => {
        if (response.status === 200 && response.data) {
          this.addressList = response.data;
        }
      },
      error: (error: ResponseStructure<AddressResponse[]>) => {
        this.snackBar.open(error.message, '', { duration: 3000 });
      }
    });
  };


  @ViewChild("editAddress") editAddress: ElementRef | undefined;

  closeEditAddress(): void {
    if (this.editAddress) {
      this.editAddress.nativeElement.style.display = "none";
    }
  };

  editableAddress!: AddressResponse;

  getEditAddress(): void {
    this.addressService.getAddressById(this.editAddressId).subscribe({
      next: (response: ResponseStructure<AddressResponse>) => {
        if (response.status === 200 && response.data) {
          this.editableAddress = response.data
          this.newEditAddress.patchValue({
            streetName: this.editableAddress.streetName,
            city: this.editableAddress.city,
            state: this.editableAddress.state,
            pinCode: this.editableAddress.pinCode
          });
        }
      },
      error: (error: ResponseStructure<AddressResponse>) => {
        this.snackBar.open(error.message, '', { duration: 3000 });
      }
    });
  };


  newEditAddress: FormGroup = this.formBuilder.group({
    streetName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required])
  });

  editAddressId: number = 0;

  editOldAddress(id: number): void {
    this.editAddressId = id;
    if (this.editAddress) {
      this.editAddress.nativeElement.style.display = "block";
      this.getEditAddress();
    }
  };

  saveNewAddress(): void {
    this.editableAddress = Object.assign(new Address(), this.newEditAddress.value);
    this.editableAddress.addressId = this.editAddressId;
    this.addressService.editAddress(this.editableAddress.addressId, this.editableAddress).subscribe({
      next: (response: ResponseStructure<AddressResponse>) => {
        if (response.status === 200) {
          this.snackbar.open("Address edited successfully", '', { duration: 3000 })
          this.addressService.onAddressChange.next(true);
          this.closeEditAddress();
        }
      },
      error: (error: ResponseStructure<AddressResponse>) => {
        this.snackBar.open(error.message, '', { duration: 3000 });
      }
    });
  };


  deleteAddress(id: number): void {
    const rs = confirm("Do you want to delete the address ?");
    if (rs) {
      this.addressService.deleteAddress(id).subscribe({
        next: (response: ResponseStructure<string>) => {
          if (response.status === 200) {
            this.snackbar.open(response.message, '', { duration: 3000 });
            this.addressService.onAddressChange.next(true);
          }
        },
        error: (error: ResponseStructure<string>) => {
          this.snackBar.open(error.message, '', { duration: 3000 });
        }
      });
    }
  };

  addressControl = new FormControl('', [Validators.required]);

  selectedAddress: Address = new Address();

  onAddressSelect(event: any): void {
    this.selectedAddress = event.value;
    console.log('Selected Address:', this.selectedAddress);
  };

  createOrder: OrderRequest = new OrderRequest();

  onPlaceOrder(): void {
    if (this.addressControl.invalid) {
      this.snackbar.open("Please select atleast one address", '', { duration: 3000 });
    }
    else if (this.totalQuantity <= 0) {
      this.snackBar.open('Please add atleast one book to place order :)', '', { duration: 3000 });
    }
    else {
      this.createOrder.addressId = this.selectedAddress.addressId;
      this.orderService.placeOrder(this.createOrder).subscribe({
        next: (response: ResponseStructure<OrderResponse>) => {
          if (response.status === 201) {
            this.snackbar.open(response.message, '', { duration: 3000 });
            this.router.navigateByUrl("/order-placed");
            this.cartService.onCartCalled.next(true);
          }
        },
        error: (error: ResponseStructure<OrderResponse>) => {
          this.snackBar.open(error.message, '', { duration: 3000 });
        }
      })
    }
  };// onPlaceOrder ending

  readonly dialog = inject(MatDialog);

  openAddAddress(): void {
    this.dialog.open(AddAddressComponent, {
      panelClass: 'right-dialog-container',
      width: '400px',
      height: '370px'
    })
  };
}
