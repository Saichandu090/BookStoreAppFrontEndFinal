import { IBookResponse } from "../interfaces/books"
import { Book } from "./book"

export class Cart{
    bookId:number
    quantity:number
    
    constructor(){
        this.bookId=0,
        this.quantity=1
    }
}


export class Address{
    addressId:number
    streetName:string
    city:string
    state:string
    pinCode:number
    userId:number

    constructor(){
        this.addressId=0,
        this.streetName='',
        this.city='',
        this.state='',
        this.pinCode=0,
        this.userId=0
    }
}


export class WishListReq{
    bookId:number

    constructor(){
        this.bookId=0
    }
}