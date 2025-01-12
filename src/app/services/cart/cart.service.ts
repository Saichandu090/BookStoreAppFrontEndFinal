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
}
