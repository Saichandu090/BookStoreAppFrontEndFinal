import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cart } from '../../model/classes/cart';
import { Observable, Subject } from 'rxjs';
import { ResponseStructure } from '../../model/interfaces/jsonresponse';
import { APP_CONSTANTS } from '../../constants/constant';
import { CartResponse } from '../../model/interfaces/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseURL: string = 'http://localhost:8080/cart/';

  private http: HttpClient = inject(HttpClient);

  onCartCalled: Subject<boolean> = new Subject<boolean>();

  getHeaders(): HttpHeaders {
    let token = localStorage.getItem(APP_CONSTANTS.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return headers;
  }

  addBookToCart(cartObj: Cart): Observable<ResponseStructure<CartResponse>> {
    const headers = this.getHeaders();
    return this.http.post<ResponseStructure<CartResponse>>(this.baseURL + 'addToCart', cartObj, { headers })
  }

  removeBookFromCart(cartId: number): Observable<ResponseStructure<CartResponse>> {
    const headers = this.getHeaders();
    return this.http.delete<ResponseStructure<CartResponse>>(`${this.baseURL}removeFromCart/${cartId}`, { headers })
  }

  getUserCart(): Observable<ResponseStructure<CartResponse[]>> {
    const headers = this.getHeaders();
    return this.http.get<ResponseStructure<CartResponse[]>>(this.baseURL + 'getCart', { headers })
  }
}
