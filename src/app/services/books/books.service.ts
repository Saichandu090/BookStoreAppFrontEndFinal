import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IBookResponse } from '../../model/interfaces/books';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { Constant } from '../../constants/constant';
import { Book } from '../../model/classes/book';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private baseURL:string="http://localhost:8080/books/";

  private http:HttpClient=inject(HttpClient);

  onBookChanged: Subject<boolean> = new Subject<boolean>();

  getAllBooks():Observable<IJsonResponse>{

    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<IJsonResponse>(this.baseURL+"allBooks",{ headers })
  }


  addNewBook(obj:Book):Observable<IJsonResponse>{
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<IJsonResponse>(this.baseURL+'addBook',obj,{headers})
  }

  deleteBook(id:number):Observable<IJsonResponse>{
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.delete<IJsonResponse>(`${this.baseURL}deleteBook/${id}`,{headers})
  }

  updateBook(id:number,obj:Book):Observable<IJsonResponse>{
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put<IJsonResponse>(`${this.baseURL}updateBook/${id}`,obj,{headers})
  }

  getBookById(id:number):Observable<IJsonResponse>{
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get<IJsonResponse>(`${this.baseURL}byBookId/${id}`,{headers})
  }

}
