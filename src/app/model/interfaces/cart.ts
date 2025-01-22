
export class CartD{
    cartId:number;
    bookId:number;
    bookPrice:number
    quantity:number;
    totalPrice:number;
    bookName:string;
    bookLogo:string;

    constructor(){
      this.cartId=0,
      this.bookPrice=0
      this.bookId=0
      this.bookLogo='',
      this.bookName='',
      this.quantity=0,
      this.totalPrice=0
    }
}


export interface IAddress{
    addressId:number,
    streetName:string,
    city:string,
    state:string,
    pinCode:number,
    userId:number;
}

export interface CartResponse{
  cartId:number,
  bookId:number,
  cartQuantity:number
}
