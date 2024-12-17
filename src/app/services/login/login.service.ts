import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { ILogin, IUserRegister } from '../../model/interfaces/userRegister';
import { LoggedInUser, UserRegister } from '../../model/classes/user';

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
}
