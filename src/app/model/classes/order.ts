import { Cart } from "./cart";

export class OrderRes{
    orderId:number;
    orderDate:Date;
    orderPrice:number;
    orderQuantity:number;
    carts:Cart[];
    cancelOrder:boolean;
    addressId:number;
    userId:number;

    constructor(){
        this.orderId=0,
        this.orderDate=new Date(),
        this.orderPrice=0,
        this.orderQuantity=0,
        this.carts=[],
        this.cancelOrder=false
        this.addressId=0,
        this.userId=0
    }
}