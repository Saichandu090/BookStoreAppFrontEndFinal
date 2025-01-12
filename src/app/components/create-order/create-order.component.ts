import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAddress, ICart } from '../../model/interfaces/cart';
import { CartService } from '../../services/cart/cart.service';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { AddressService } from '../../services/address/address.service';
import { Address } from '../../model/classes/cart';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';
import { IOrder } from '../../model/interfaces/order';
import { OrderService } from '../../services/order/order.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BooksService } from '../../services/books/books.service';

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

  cartData: ICart[] = [];

  onRemoveCart(cartId: number) {
    const rs = confirm("Do you want to remove this item from the cart ?");
    if (rs) {
      this.getCart(cartId);
      this.cartService.removeCart(cartId).subscribe((res: IJsonResponse) => {
        if (res.result) {
          this.snackbar.open(res.message, '', { duration: 3000 })
          this.cartService.onCartCalled.next(true);
          this.bookService.onBookChanged.next(true);
        }
      })
    }
  }

  getCart(cartId: number) {
    this.cartService.getUserCartById(cartId).subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.cartObj = res.data[0]
        console.log(this.cartObj)
      }
    })
  }

  cartObj: ICart = {
    userId: 0,
    cartId: 0,
    bookName: '',
    quantity: 0,
    bookLogo: '',
    totalPrice: 0
  }

  totalQuantity: number = 0;
  totalPrice: number = 0;

  getUserCart() {
    this.cartService.getUserCart().subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.cartData = res.data;
        this.totalPrice = 0;
        this.totalQuantity = 0;
        this.cartData.forEach(element => {
          this.totalPrice = element.totalPrice + this.totalPrice;
          this.totalQuantity = element.quantity + this.totalQuantity;
        });
      }
    })
  }

  ngOnInit(): void {
    this.getUserCart();
    this.getAllUserAddress();
    this.addressService.onAddressChange.subscribe((res: boolean) => {
      if (res) {
        this.getAllUserAddress();
      }
    })
    this.cartService.onCartCalled.subscribe((res: boolean) => {
      if (res) {
        this.getUserCart();
      }
    })
  }

  //===================================================//

  @ViewChild("addAddress") addAddress: ElementRef | undefined;

  openAddAddress() {
    if (this.addAddress) {
      this.addAddress.nativeElement.style.display = "block";
    }
  }

  closeAddAddress() {
    if (this.addAddress) {
      this.addAddress.nativeElement.style.display = "none";
    }
  }

  addressList: IAddress[] = [];

  private fb: FormBuilder = inject(FormBuilder);

  newAddress: FormGroup = this.fb.group({
    streetName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required])
  })

  private addressService: AddressService = inject(AddressService);

  getAllUserAddress() {
    this.addressService.getAllAddress().subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.addressList = res.data;
      }
    })
  }

  address = new Address();

  //toaster = inject(ToastrService);

  addNewAddress() {
    this.address = Object.assign(new Address(), this.newAddress.value);
    console.log(this.address)
    this.addressService.addAddress(this.address).subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.snackbar.open("Address added successfully", '', { duration: 3000 })
        this.addressService.onAddressChange.next(true);
        this.closeAddAddress();
      }
    })
  }


  //=====================================//


  @ViewChild("editAddress") editAddress: ElementRef | undefined;

  closeEditAddress() {
    if (this.editAddress) {
      this.editAddress.nativeElement.style.display = "none";
    }
  }



  editableAddress: Address = new Address();

  getEditAddress() {
    this.addressService.getAddressById(this.editAddressId).subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.editableAddress = res.data[0]

        this.newEditAddress.patchValue({
          streetName: this.editableAddress.streetName,
          city: this.editableAddress.city,
          state: this.editableAddress.state,
          pinCode: this.editableAddress.pinCode
        })
        console.log(this.editableAddress)
      } else {
        this.snackbar.open(res.message, '', { duration: 3000 })
      }
    })
  }

  newEditAddress: FormGroup = this.fb.group({
    streetName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required])
  })

  editAddressId: number = 0;

  editOldAddress(id: number) {
    this.editAddressId = id;
    if (this.editAddress) {
      this.editAddress.nativeElement.style.display = "block";
      this.getEditAddress();
    }
  }

  saveNewAddress() {
    this.editableAddress = Object.assign(new Address(), this.newEditAddress.value);
    this.editableAddress.addressId = this.editAddressId;
    console.log(this.editableAddress)
    this.addressService.editAddress(this.editableAddress.addressId, this.editableAddress).subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.snackbar.open("Address edited successfully", '', { duration: 3000 })
        this.addressService.onAddressChange.next(true);
        this.closeEditAddress();
      } console.error(res.message);
    })
  }


  deleteAddress(id: number) {
    const rs = confirm("Do you want to delete the address ?");
    if (rs) {
      this.addressService.deleteAddress(id).subscribe((res: IJsonResponse) => {
        if (res.result) {
          this.snackbar.open(res.message, '', { duration: 3000 });
          this.addressService.onAddressChange.next(true);
        } else {
          this.snackbar.open(res.message, '', { duration: 3000 });
        }
      })
    }
  }

  //===================================================//

  addressControl = new FormControl('', [Validators.required]);

  selectedAddress: Address = new Address();

  onAddressSelect(event: any) {
    this.selectedAddress = event.value;
    console.log('Selected Address:', this.selectedAddress);
  }

  createOrder: IOrder = {
    price: 0,
    quantity: 0,
    addressId: 0
  }

  orderService: OrderService = inject(OrderService);

  router: Router = inject(Router);

  onPlaceOrder() {
    if (this.addressControl.invalid) {
      this.snackbar.open("Please select atleast one address", '', { duration: 3000 })
    } else {
      this.createOrder.addressId = this.selectedAddress.addressId;
      this.createOrder.price = this.totalPrice;
      this.createOrder.quantity = this.totalQuantity;
      if (this.createOrder.quantity <= 0)
        this.snackbar.open("Select atleast one product to place order", '', { duration: 3000 });
      else {
        this.orderService.placeOrder(this.createOrder).subscribe((res: IJsonResponse) => {
          if (res.result) {
            this.snackbar.open(res.message, '', { duration: 3000 });
            this.router.navigateByUrl("/homepage");
            this.cartService.onCartCalled.next(true);
          }
        })
      }
    }
  }// onPlaceOrder ending





}
