import { Method } from './../../../../node_modules/@babel/types/lib/index-legacy.d';
import { ResponseStructure, BookResponse } from './../../model/interfaces/jsonresponse';
import { TestBed } from '@angular/core/testing';
import { BooksService } from './books.service';
import { HttpTestingController, provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';
import { Book } from '../../model/classes/book';
import { HttpHeaders } from '@angular/common/http';

describe('BooksService', () => {
  let service: BooksService;
  let httpMock: HttpTestingController;
  let baseUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BooksService, provideHttpClientTesting()]
    });
    service = TestBed.inject(BooksService);
    httpMock = TestBed.inject(HttpTestingController);
    baseUrl = 'http://localhost:8080/book/';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a book successfully', () => {
    const book: Book = {
      bookId: 1,
      bookName: "Testing",
      bookAuthor: "Chandu",
      bookPrice: 123.45,
      bookDescription: 'Learn testing',
      bookLogo: 'URL',
      bookQuantity: 34
    };

    const mockBookResponse: ResponseStructure<BookResponse> = {
      status: 201,
      message: 'Book added successfully',
      data: {
        bookId: 1,
        bookName: "Testing",
        bookAuthor: "Chandu",
        bookPrice: 123.45,
        bookDescription: 'Learn testing',
        bookLogo: 'URL',
        bookQuantity: 34
      }
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.addNewBook(book).subscribe({
      next: (response: ResponseStructure<BookResponse>) => {
        if (response.data) {
          expect(response.status).toBe(201);
          expect(response.data.bookId).toBe(1);
          expect(response.data.bookName).toBe('Testing');
        }
      },
      error: (error) => {
        fail('response expected in add book');
      }
    });


    const urlRequest = httpMock.expectOne(baseUrl + 'addBook');
    expect(urlRequest.request.method).toBe('POST');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });


  it('should give an error response to add Book', () => {
    const book: Book = {
      bookId: 1,
      bookName: "Testing",
      bookAuthor: "Chandu",
      bookPrice: 0,
      bookDescription: 'Learn testing',
      bookLogo: 'URL',
      bookQuantity: 34
    };

    const mockBookResponse: any = {
      status: 400,
      message: 'Book price should be valid',
      data: null
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.addNewBook(book).subscribe({
      next: (response) => {
        fail('error expected in add book')
      },
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Book price should be valid');
      }
    });

    const urlRequest = httpMock.expectOne(baseUrl + 'addBook');
    expect(urlRequest.request.method).toBe('POST');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });


  it('should get a book by Id successfully', () => {
    const bookId: number = 1;
    const mockBookResponse: ResponseStructure<BookResponse> = {
      status: 200,
      message: 'Book fetched successully',
      data: {
        bookId: 1,
        bookName: "Testing",
        bookAuthor: "Chandu",
        bookPrice: 987.3,
        bookDescription: 'Learn testing',
        bookLogo: 'URL',
        bookQuantity: 34
      }
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.getBookById(bookId).subscribe({
      next: (response: ResponseStructure<BookResponse>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.data.bookId).toBe(1);
          expect(response.data.bookName).toBe('Testing');
        }
      },
      error: (error) => {
        fail('response expected in getBookById');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getBookById/${bookId}`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });


  it('should throw error 404 Book not found', () => {
    const bookId: number = 1;
    const mockBookResponse: ResponseStructure<BookResponse> = {
      status: 404,
      message: 'Book not found',
      data: null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.getBookById(bookId).subscribe({
      next: (response) => {
        fail('expected error in getBookById')
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Book not found');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getBookById/${bookId}`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });


  it('should fetched 2 books', () => {
    const mockBookResponse: ResponseStructure<BookResponse[]> = {
      status: 200,
      message: 'Books fetched successully',
      data: [
        {
          bookId: 1,
          bookName: "Testing",
          bookAuthor: "Chandu",
          bookPrice: 987.3,
          bookDescription: 'Learn testing',
          bookLogo: 'URL',
          bookQuantity: 34
        },
        {
          bookId: 2,
          bookName: 'Testing Book 2',
          bookAuthor: 'Chandu',
          bookPrice: 1025.5,
          bookDescription: 'Learn testing with Book 2',
          bookLogo: 'URL2',
          bookQuantity: 50
        }
      ]
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.getAllBooks().subscribe({
      next: (response: ResponseStructure<BookResponse[]>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.data.length).toBe(2);
          expect(response.data[0].bookId).toBe(1);
          expect(response.data[0].bookName).toBe('Testing');
          expect(response.data[1].bookId).toBe(2);
          expect(response.data[1].bookName).toBe('Testing Book 2');
        }
      },
      error: (error) => {
        fail('response expected in getAllBooks');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getBooks`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });


  it('should sort the books by name', () => {
    const field = 'bookName';
    const mockBookResponse: ResponseStructure<BookResponse[]> = {
      status: 200,
      message: 'Books sorted successully',
      data: [
        {
          bookId: 1,
          bookName: "Alpha",
          bookAuthor: "Chandu",
          bookPrice: 987.3,
          bookDescription: 'Learn testing',
          bookLogo: 'URL',
          bookQuantity: 34
        },
        {
          bookId: 2,
          bookName: 'Beta',
          bookAuthor: 'Chandu',
          bookPrice: 1025.5,
          bookDescription: 'Learn testing with Book 2',
          bookLogo: 'URL2',
          bookQuantity: 50
        }
      ]
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.sortByField(field).subscribe({
      next: (response: ResponseStructure<BookResponse[]>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.data.length).toBe(2);
          expect(response.data[0].bookId).toBe(1);
          expect(response.data[0].bookName).toBe('Alpha');
          expect(response.data[1].bookId).toBe(2);
          expect(response.data[1].bookName).toBe('Beta');
        }
      },
      error: (error) => {
        fail('response expected in sortByField');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}sortBy/${field}`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });


  it('should handle the error in sortByField', () => {
    const field = 'bookName';
    const mockBookResponse: ResponseStructure<BookResponse[]> = {
      status: 400,
      message: 'Bad request',
      data: null
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.sortByField(field).subscribe({
      next: (response: ResponseStructure<BookResponse[]>) => {
        if (response.data) {
          fail('expected error in sortByField');
        }
      },
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Bad request');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}sortBy/${field}`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });


  it('should return No-Content message', () => {
    const mockBookResponse: ResponseStructure<BookResponse[]> = {
      status: 204,
      message: 'No books are available',
      data: null
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.getAllBooks().subscribe({
      next: (response: ResponseStructure<BookResponse[]>) => {
        expect(response.status).toBe(204);
        expect(response.message).toBe('No books are available');
      },
      error: (error) => {
        fail('response expected in getAllBooks');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getBooks`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });


  it('should update a book with bookId given', () => {
    const book: Book = {
      bookId: 1,
      bookName: "Testing",
      bookAuthor: "Chandu",
      bookPrice: 987.3,
      bookDescription: 'Learn testing',
      bookLogo: 'URL',
      bookQuantity: 34
    }

    const mockBookResponse: ResponseStructure<BookResponse> = {
      status: 200,
      message: 'Book updated successully',
      data: {
        bookId: 1,
        bookName: "Testing",
        bookAuthor: "Chandu",
        bookPrice: 987.3,
        bookDescription: 'Learn testing',
        bookLogo: 'URL',
        bookQuantity: 34
      }
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.updateBook(book.bookId, book).subscribe({
      next: (response: ResponseStructure<BookResponse>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.data.bookId).toBe(1);
          expect(response.data.bookName).toBe('Testing');
          expect(response.message).toBe('Book updated successully');
        }
      },
      error: (error) => {
        fail('response expected in updateBook');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}updateBook/${book.bookId}`);
    expect(urlRequest.request.method).toBe('PUT');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });


  it('should fail to update a book with bookId given', () => {
    const book: Book = {
      bookId: 1,
      bookName: "Testing",
      bookAuthor: "Chandu",
      bookPrice: 987.3,
      bookDescription: 'Learn testing',
      bookLogo: 'URL',
      bookQuantity: 34
    }

    const mockBookResponse: ResponseStructure<BookResponse> = {
      status: 404,
      message: 'Book not found',
      data: null
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.updateBook(book.bookId, book).subscribe({
      next: (response: ResponseStructure<BookResponse>) => {
        if (response.data) {
          fail('expected error in updateBook');
        }
      },
      error: (error: ResponseStructure<BookResponse>) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Book not found');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}updateBook/${book.bookId}`);
    expect(urlRequest.request.method).toBe('PUT');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });


  it('should delete a book with bookId given', () => {
    const bookId: number = 12;
    const mockBookResponse: ResponseStructure<string> = {
      status: 200,
      message: 'Book deleted successully',
      data: 'Book deleted'
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.deleteBook(bookId).subscribe({
      next: (response: ResponseStructure<string>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.message).toBe('Book updated successully');
        }
      },
      error: (error) => {
        fail('response expected in deleteBook');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}deleteBook/${bookId}`);
    expect(urlRequest.request.method).toBe('DELETE');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });



  it('should return an error 404', () => {
    const bookId: number = 12;
    const mockBookResponse: ResponseStructure<string> = {
      status: 404,
      message: 'Book not found',
      data: null
    };
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.deleteBook(bookId).subscribe({
      next: (response: ResponseStructure<string>) => {
        fail('expected error in deleteBook');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Book not found');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}deleteBook/${bookId}`);
    expect(urlRequest.request.method).toBe('DELETE');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockBookResponse);
  });
});
