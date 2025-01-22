import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IJsonResponse, LoginResponse, RegisterResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { ILogin } from '../../model/interfaces/user';
import { UserEdit, UserRegister } from '../../model/classes/user';
import { Constant } from '../../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseURL: string = "http://localhost:8080/";

  private http: HttpClient = inject(HttpClient);

  getHeaders():HttpHeaders{
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return headers;
  }

  registerUser(user: UserRegister): Observable<ResponseStructure<RegisterResponse>> {
    return this.http.post<ResponseStructure<RegisterResponse>>(this.baseURL + "register", user)
  }

  loginUser(user: ILogin): Observable<ResponseStructure<LoginResponse>> {
    return this.http.post<ResponseStructure<LoginResponse>>(this.baseURL + "login", user);
  }
}
