import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { Constant } from '../../constants/constant';
import { IBookResponse } from '../../model/interfaces/books';
import { WishListReq } from '../../model/classes/cart';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private baseURL: string = "http://localhost:8080/wishList/";

  private http: HttpClient = inject(HttpClient);

  onWishListChanged:Subject<boolean> =new Subject<boolean>();

  addToWishList(book: WishListReq): Observable<IJsonResponse> {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<IJsonResponse>(this.baseURL + "addToWishList", book, { headers })
  }

  removeFromWishList(bookId: number): Observable<IJsonResponse> {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<IJsonResponse>(`${this.baseURL}removeFromWishList/${bookId}`, { headers })
  }

  getWishList(): Observable<IJsonResponse> {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<IJsonResponse>(`${this.baseURL}getWishList`, { headers })
  }

  isInWishList(bookId: number): Observable<IJsonResponse> {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<IJsonResponse>(`${this.baseURL}isInWishList/${bookId}`,{headers})
  }
}
