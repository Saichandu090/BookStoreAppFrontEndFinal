export class Cart{
    bookId:number

    constructor(){
        this.bookId=0
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

export class AddressRequest{
  streetName:string
  city:string
  state:string
  pinCode:number

  constructor(){
      this.streetName='',
      this.city='',
      this.state='',
      this.pinCode=0
  }
}


export class WishListRequest{
    bookId:number
    constructor(){
        this.bookId=0
    }
}
