import { Component, inject, OnInit } from '@angular/core';
import { IBook } from '../../model/interfaces/books';
import { BooksService } from '../../services/books/books.service';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit{


  bookList:IBook[]=[];

  private bookService=inject(BooksService);

  getAllBooks(){
    this.bookService.getAllBooks().subscribe((res:IJsonResponse)=>{
      this.bookList=res.data;
    })
  }

  ngOnInit(): void {
      this.getAllBooks();
  }
}
