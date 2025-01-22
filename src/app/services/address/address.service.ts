import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AddressResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { APP_CONSTANTS } from '../../constants/constant';
import { AddressRequest } from '../../model/classes/cart';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private baseURL: string = 'http://localhost:8080/address/'

  private http: HttpClient = inject(HttpClient);

  onAddressChange:Subject<boolean>=new Subject<boolean>();

  getHeaders():HttpHeaders{
    let token = localStorage.getItem(APP_CONSTANTS.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return headers;
  }

  addAddress(addressObject: AddressRequest): Observable<ResponseStructure<AddressResponse>> {
    const headers=this.getHeaders();
    return this.http.post<ResponseStructure<AddressResponse>>(this.baseURL + 'addAddress', addressObject, { headers });
  }

  getAllAddress(): Observable<ResponseStructure<AddressResponse[]>> {
    const headers=this.getHeaders();
    return this.http.get<ResponseStructure<AddressResponse[]>>(this.baseURL + 'getAllAddress', { headers });
  }

  getAddressById(addressId:number): Observable<ResponseStructure<AddressResponse>> {
    const headers=this.getHeaders();
    return this.http.get<ResponseStructure<AddressResponse>>(`${this.baseURL}getAddress/${addressId}`, { headers });
  }

  deleteAddress(addressId: number): Observable<ResponseStructure<string>> {
    const headers=this.getHeaders();
    return this.http.delete<ResponseStructure<string>>(`${this.baseURL}deleteAddress/${addressId}`, { headers });
  }

  editAddress(addressId: number, addressObject: AddressRequest): Observable<ResponseStructure<AddressResponse>> {
    const headers=this.getHeaders();
    return this.http.put<ResponseStructure<AddressResponse>>(`${this.baseURL}editAddress/${addressId}`, addressObject, { headers });
  }
}
