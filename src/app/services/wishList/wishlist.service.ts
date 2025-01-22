import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ResponseStructure, WishListResponse } from '../../model/interfaces/jsonresponse';
import { Constant } from '../../constants/constant';
import { WishListRequest } from '../../model/classes/cart';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private baseURL: string = "http://localhost:8080/wishlist/";

  private http: HttpClient = inject(HttpClient);

  onWishListChanged:Subject<boolean> =new Subject<boolean>();

  getHeaders():HttpHeaders{
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return headers;
  }

  addToWishList(wishListObject: WishListRequest): Observable<ResponseStructure<WishListResponse>> {
    const headers=this.getHeaders();
    return this.http.post<ResponseStructure<WishListResponse>>(this.baseURL + "addToWishList", wishListObject, { headers });
  }

  getWishList(): Observable<ResponseStructure<WishListResponse[]>> {
    const headers=this.getHeaders();
    return this.http.get<ResponseStructure<WishListResponse[]>>(`${this.baseURL}getWishList`, { headers });
  }
}
