import { Book } from "../classes/book";
import { AddressResponse } from "./jsonresponse";

export class OrderRequest{
  addressId:number

  constructor(){
    this.addressId=0
  }
}

export interface OrderResponse{
  orderId:number,
  orderDate:string,
  orderPrice:number,
  orderQuantity:number,
  cancelOrder:boolean,
  orderAddress:AddressResponse,
  orderBooks:Book[]
}
