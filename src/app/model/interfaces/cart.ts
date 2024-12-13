
export interface ICart{
    cartId:number;
    userId:number;
    quantity:number;
    totalPrice:number;
    bookName:string;
    bookLogo:string;
}


export interface IAddress{
    streetName:string,
    city:string,
    state:string,
    pinCode:number,
    userId:number;
}
