import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cart } from '../../model/classes/cart';
import { Observable, Subject } from 'rxjs';
import { IJsonResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { Constant } from '../../constants/constant';
import { Book } from '../../model/classes/book';
import { IBookResponse } from '../../model/interfaces/books';
import { ToastrService } from 'ngx-toastr';
import { CartResponse } from '../../model/interfaces/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseURL: string = 'http://localhost:8080/cart/';

  private http: HttpClient = inject(HttpClient);

  onCartCalled: Subject<boolean> = new Subject<boolean>();

  toaster=inject(ToastrService);

  getHeaders():HttpHeaders{
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return headers;
  }

  addBookToCart(cartObj: Cart): Observable<ResponseStructure<CartResponse>> {
    const headers=this.getHeaders();
    return this.http.post<ResponseStructure<CartResponse>>(this.baseURL + 'addToCart', cartObj, { headers })
  }

  removeBookFromCart(cartId: number): Observable<IJsonResponse> {
    const headers=this.getHeaders();
    return this.http.delete<IJsonResponse>(`${this.baseURL}removeFromCart/${cartId}`, { headers })
  }

  getUserCart(): Observable<ResponseStructure<CartResponse[]>> {
    const headers=this.getHeaders();
    return this.http.get<ResponseStructure<CartResponse[]>>(this.baseURL + 'getCart', { headers })
  }


  getUserCartById(cartId: number): Observable<IJsonResponse> {
    const headers=this.getHeaders();
    return this.http.get<IJsonResponse>(`${this.baseURL}getCartById/${cartId}`, { headers })
  }


}
