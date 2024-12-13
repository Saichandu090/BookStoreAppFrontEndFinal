import { Book } from "../classes/book";

export interface ICart{
    cartId:number;
    userId:number;
    quantity:number;
    totalPrice:number;
    bookName:string;
    bookLogo:string;
}