import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order/order.service';
import { AddressResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { OrderResponse } from '../../model/interfaces/order';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {

  orderId!: number;

  address!:string;

  email:string='chandu45@gmail.com';

  private router: Router = inject(Router);

  private orderService: OrderService = inject(OrderService);

  private snackBar: MatSnackBar = inject(MatSnackBar);

  continue():void {
    this.router.navigateByUrl('/homepage');
  }

  ngOnInit():void {
    this.orderService.getAllOrders().subscribe({
      next: (response: ResponseStructure<OrderResponse[]>) => {
        if (response.status === 200 && response.data && response.data.length > 0) {
          const order = response.data[response.data.length - 1]; // Get the last placed order
          this.orderId = order.orderId;
          this.address =
            order.orderAddress.streetName + ', ' +
            order.orderAddress.city + ', ' +
            order.orderAddress.state;
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        this.snackBar.open(errorMessage, '', { duration: 3000 });
      }
    });
  };
}
