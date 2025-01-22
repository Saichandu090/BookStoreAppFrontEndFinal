import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BookResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { Constant } from '../../constants/constant';
import { Book } from '../../model/classes/book';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  private baseURL:string="http://localhost:8080/book/";

  private http:HttpClient=inject(HttpClient);

  onBookChanged: Subject<boolean> = new Subject<boolean>();

  getHeaders():HttpHeaders{
    let token = localStorage.getItem(Constant.LOGIN_TOKEN);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return headers;
  }

  addNewBook(bookObject:Book):Observable<ResponseStructure<BookResponse>>{
    const headers=this.getHeaders();
    return this.http.post<ResponseStructure<BookResponse>>(this.baseURL+'addBook',bookObject,{headers})
  }

  getAllBooks():Observable<ResponseStructure<BookResponse[]>>{
    const headers=this.getHeaders();
    return this.http.get<ResponseStructure<BookResponse[]>>(this.baseURL+"getBooks",{ headers })
  }

  getBookById(bookId:number):Observable<ResponseStructure<BookResponse>>{
    const headers=this.getHeaders();
    return this.http.get<ResponseStructure<BookResponse>>(`${this.baseURL}getBookById/${bookId}`,{headers})
  }

  updateBook(bookId:number,obj:Book):Observable<ResponseStructure<BookResponse>>{
    const headers=this.getHeaders();
    return this.http.put<ResponseStructure<BookResponse>>(`${this.baseURL}updateBook/${bookId}`,obj,{headers})
  }

  deleteBook(bookId:number):Observable<ResponseStructure<string>>{
    const headers=this.getHeaders();
    return this.http.delete<ResponseStructure<string>>(`${this.baseURL}deleteBook/${bookId}`,{headers})
  }
}
