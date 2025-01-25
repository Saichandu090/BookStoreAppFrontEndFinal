import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../services/order/order.service';
import { BookResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartData } from '../../model/interfaces/cart';
import { OrderResponse } from '../../model/interfaces/order';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [PopoverModule, TableModule, ButtonModule, TagModule, MatTableModule, MatButtonModule, CommonModule,RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  providers: [MessageService]
})
export class OrdersComponent implements OnInit {

  private orderService = inject(OrderService);

  displayedColumns: string[] = ['order-Id', 'quantity', 'price', 'status', 'action'];

  orderList: OrderResponse[] = [];

  bookList : BookResponse[]=[];

  carts: CartData[] = [];

  snackbar: MatSnackBar = inject(MatSnackBar);

  router : Router=inject(Router);

  getOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response: ResponseStructure<OrderResponse[]>) => {
        if (response.status === 200 && response.data) {
          this.orderList = response.data;
        }
      },
      error: (error: ResponseStructure<OrderResponse[]>) => {
        this.snackbar.open(error.message, '', { duration: 3000 });
      }
    });
  };

  cancelOrder(orderId: number): void {
    const rs = confirm("Do you want to cancel the order ?");
    if (rs) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: (response: ResponseStructure<OrderResponse>) => {
          if (response.status === 200) {
            this.snackbar.open(response.message, '', { duration: 3000 });
            this.orderService.onOrderChanged.next(true);
          }
        },
        error: (error: ResponseStructure<OrderResponse>) => {
          this.snackbar.open(error.message, '', { duration: 3000 });
        }
      });
    }
  };

  continue():void{
    this.router.navigateByUrl('homepage');
  }


  ngOnInit(): void {
    this.getOrders();
    this.orderService.onOrderChanged.subscribe((res: boolean) => {
      if (res) {
        this.getOrders();
      }
    });
  };

}
