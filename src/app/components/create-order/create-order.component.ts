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

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {

  private cartService: CartService = inject(CartService);

  cartData: ICart[] = [];

  totalQuantity: number = 0;
  totalPrice: number = 0;

  getUserCart() {
    this.cartService.getUserCart().subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.cartData = res.data;
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
    this.addressService.onAddressChange.subscribe((res:boolean)=>{
      if(res){
        this.getAllUserAddress();
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

  toaster = inject(ToastrService);

  addNewAddress() {
    this.address = Object.assign(new Address(), this.newAddress.value);
    console.log(this.address)
    this.addressService.addAddress(this.address).subscribe((res: IJsonResponse) => {
      if (res.result) {
        this.toaster.success("Address added successfully")
        this.addressService.onAddressChange.next(true);
        this.closeAddAddress();
      }
    })
  }

  addressControl = new FormControl('',[Validators.required]);

  selectedAddress:Address=new Address();

  onAddressSelect(event: any) {
    this.selectedAddress = event.value;
    console.log('Selected Address:', this.selectedAddress);
  }

  //=====================================//

  onPlaceOrder() {
    if(this.selectedAddress.pinCode==0){
      this.toaster.error("Please select atleast one address")
    }else{
      this.toaster.success("Order placed successfully")
    }
  }

}
