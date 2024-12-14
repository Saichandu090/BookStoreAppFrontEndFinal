import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Constant } from '../../constants/constant';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { IOrder } from '../../model/interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseURL: string = "http://localhost:8080/order/";

  private http: HttpClient = inject(HttpClient);

  onOrderChanged: Subject<boolean> = new Subject<boolean>();

  placeOrder(obj:IOrder) {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<IJsonResponse>(this.baseURL + 'placeOrder', obj, { headers })
  }
}
