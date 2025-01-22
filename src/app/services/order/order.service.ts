import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Constant } from '../../constants/constant';
import { IJsonResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { IOrder, OrderRequest, OrderResponse } from '../../model/interfaces/order';
import { OrderRes } from '../../model/classes/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseURL: string = "http://localhost:8080/order/";

  private http: HttpClient = inject(HttpClient);

  onOrderChanged: Subject<boolean> = new Subject<boolean>();

  getHeaders():HttpHeaders{
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return headers;
  }

  placeOrder(orderObject: OrderRequest):Observable<ResponseStructure<OrderResponse>> {
    const headers=this.getHeaders();
    return this.http.post<ResponseStructure<OrderResponse>>(this.baseURL + 'placeOrder', orderObject, { headers })
  }

  cancelOrder(orderId: number):Observable<ResponseStructure<OrderResponse>> {
    const headers=this.getHeaders();
    return this.http.delete<ResponseStructure<OrderResponse>>(`${this.baseURL}cancelOrder/${orderId}`, { headers })
  }

  getOrders():Observable<ResponseStructure<OrderResponse[]>> {
    const headers=this.getHeaders();
    return this.http.get<ResponseStructure<OrderResponse[]>>(`${this.baseURL}getAllOrders`, { headers })
  }
}
