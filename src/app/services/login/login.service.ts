import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { ILogin, IUserRegister } from '../../model/interfaces/userRegister';
import { LoggedInUser, UserEdit, UserRegister } from '../../model/classes/user';
import { Constant } from '../../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseURL: string = "http://localhost:8080/";

  private http: HttpClient = inject(HttpClient);

  registerUser(user: UserRegister): Observable<IJsonResponse> {
    return this.http.post<IJsonResponse>(this.baseURL + "register", user)
  }

  loginUser(user: ILogin): Observable<IJsonResponse> {
    return this.http.post<IJsonResponse>(this.baseURL + "login", user);
  }

  editUser(user: UserEdit): Observable<IJsonResponse> {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put<IJsonResponse>(this.baseURL + 'editUserDetails',user, { headers });
  }

  getUser(email: string): Observable<IJsonResponse> {
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<IJsonResponse>(`${this.baseURL}getUser/${email}`, { headers });
  }
}
