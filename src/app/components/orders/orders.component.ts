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


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [PopoverModule, TableModule, ButtonModule, TagModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  providers: [MessageService]
})
export class OrdersComponent implements OnInit{

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private orderService = inject(OrderService);

  orderList:OrderRes[]=[];

  toaster=inject(ToastrService);

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
          this.toaster.success(res.message);
          this.orderService.onOrderChanged.next(true);
        }else{
          this.toaster.error(res.message)
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