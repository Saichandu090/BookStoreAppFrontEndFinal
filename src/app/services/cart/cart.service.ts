import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cart } from '../../model/classes/cart';
import { Observable, Subject } from 'rxjs';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { Constant } from '../../constants/constant';
import { Book } from '../../model/classes/book';
import { IBookResponse } from '../../model/interfaces/books';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseURL: string = 'http://localhost:8080/cart/';

  private wishListItems: IBookResponse[] = [];

  //private storageWishListItemsKey='wishListItems';

  private http: HttpClient = inject(HttpClient);

  onCartCalled: Subject<boolean> = new Subject<boolean>();

  toaster=inject(ToastrService);

  // constructor(){
  //   const storedWishListItems=localStorage.getItem(this.storageWishListItemsKey);

  //   if(storedWishListItems){
  //     this.wishListItems=JSON.parse(storedWishListItems);
  //   }
  // }

  cartTotalQuantity!: number;
  cartTotalPrice!: number;

  addToCart(obj: Cart): Observable<IJsonResponse> {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<IJsonResponse>(this.baseURL + 'addToCart', obj, { headers })
  }

  getUserCart(): Observable<IJsonResponse> {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<IJsonResponse>(this.baseURL + 'getCart', { headers })
  }


  getUserCartById(cartId: number): Observable<IJsonResponse> {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<IJsonResponse>(`${this.baseURL}getCartById/${cartId}`, { headers })
  }

  removeCart(cartId: number): Observable<IJsonResponse> {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<IJsonResponse>(`${this.baseURL}removeFromCart/${cartId}`, { headers })
  }

  // isInWishList(book: IBookResponse): boolean {
  //   return this.wishListItems.some(item => item.bookId === book.bookId);
  // }

  // addToWishList(book: IBookResponse): void {
  //   this.wishListItems.push(book);
  //   localStorage.setItem(this.storageWishListItemsKey,JSON.stringify(this.wishListItems));
  //   this.toaster.success(`${book.bookName} has added to wishlist successfully!!`);
  // }

  // removeFromWishList(book:IBookResponse):void{
  //   const index=this.wishListItems.findIndex(item=>item.bookId===book.bookId);
  //   if(index!==-1)
  //   {
  //     this.wishListItems.splice(index,1);
  //     localStorage.setItem(this.storageWishListItemsKey,JSON.stringify(this.wishListItems));
  //     this.toaster.success(`${book.bookName} has removed from wishlist successfully!!`)
  //   }
  // }
}
