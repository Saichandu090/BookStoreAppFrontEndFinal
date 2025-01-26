export interface ResponseStructure<T> {
  status: number;
  message: string;
  data: T | null;
}

export interface LoginResponse {
  email:string,
  role:string
}

export interface RegisterResponse {
  userId: number;
  email: string;
  role: string;
}

export interface WishListResponse{
  wishListId:number,
  bookId:number
}

export interface BookResponse{
  bookId:number,
  bookName:string,
  bookAuthor:string,
  bookDescription:string,
  bookPrice:number,
  bookLogo:string
  bookQuantity:number,
}

export interface AddressResponse{
  addressId:number,
  streetName:string,
  city:string,
  state:string,
  pinCode:number
}
