export interface IJsonResponse{
    result:boolean,
    message:string,
    data:any
}

export interface ResponseStructure<T> {
  status: number;
  message: string;
  data: T;
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
