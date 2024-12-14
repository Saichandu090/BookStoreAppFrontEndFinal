import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { OrderRes } from '../../model/classes/order';
import { OrderService } from '../../services/order/order.service';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [PopoverModule, TableModule, ButtonModule, TagModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
  providers: [MessageService]
})
export class OrdersComponent {

  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private orderService = inject(OrderService);

  orderList:OrderRes[]=[];

  editOldAddress(id:number){

  }
}
