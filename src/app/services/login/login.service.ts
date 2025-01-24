import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse, RegisterResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { ILogin } from '../../model/interfaces/user';
import { NewPassword, UserRegister } from '../../model/classes/user';
import { APP_CONSTANTS } from '../../constants/constant';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseURL: string = "http://localhost:8080/";

  private http: HttpClient = inject(HttpClient);

  getHeaders(): HttpHeaders {
    let token = localStorage.getItem(APP_CONSTANTS.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return headers;
  }

  registerUser(registerObject: UserRegister): Observable<ResponseStructure<RegisterResponse>> {
    return this.http.post<ResponseStructure<RegisterResponse>>(this.baseURL + "register", registerObject)
  }

  loginUser(loginObject: ILogin): Observable<ResponseStructure<LoginResponse>> {
    return this.http.post<ResponseStructure<LoginResponse>>(this.baseURL + "login", loginObject);
  }

  isUserExists(email: string): Observable<ResponseStructure<boolean>> {
    return this.http.get<ResponseStructure<boolean>>(`${this.baseURL}isUserExists/${email}`);
  }

  forgetPassword(newPasswordObject: NewPassword): Observable<ResponseStructure<boolean>> {
    return this.http.put<ResponseStructure<boolean>>(this.baseURL + 'forgetPassword', newPasswordObject);
  }
}
