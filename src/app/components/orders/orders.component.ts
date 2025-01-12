import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { OrderRes } from '../../model/classes/order';
import { OrderService } from '../../services/order/order.service';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { Toast, ToastrService } from 'ngx-toastr';
import { ICart } from '../../model/interfaces/cart';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [PopoverModule, TableModule, ButtonModule, TagModule,MatTableModule,MatButtonModule,CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  providers: [MessageService]
})
export class OrdersComponent implements OnInit{

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private orderService = inject(OrderService);

  displayedColumns: string[] = [ 'order-Id', 'quantity', 'price','status','action'];

  orderList:OrderRes[]=[];

  carts:ICart[]=[];

  snackbar:MatSnackBar=inject(MatSnackBar);
  //toaster=inject(ToastrService);

  getOrders(){
    this.orderService.getOrders().subscribe((res:IJsonResponse)=>{
      if(res.result){
        this.orderList=res.data
      }
    })
  }

  cancelOrder(id:number){
    const rs=confirm("Do you want to cancel the order ?");
    if(rs){
      this.orderService.cancelOrder(id).subscribe((res:IJsonResponse)=>{
        if(res.result){
          this.snackbar.open(res.message,'',{duration:3000});
          this.orderService.onOrderChanged.next(true);
        }else{
          this.snackbar.open(res.message,'',{duration:3000});
        }
      })
    }
  }


  ngOnInit(): void {
    this.getOrders();
    this.orderService.onOrderChanged.subscribe((res:boolean)=>{
      if(res){
        this.getOrders();
      }
    })
  }

}
