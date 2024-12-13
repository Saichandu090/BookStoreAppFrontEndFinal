import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICart } from '../../model/interfaces/cart';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {

  cartData:ICart[]=[];

  onPlaceOrder(){
    
  }
}
