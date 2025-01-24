import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Cart } from '../../model/classes/cart';
import { ResponseStructure } from '../../model/interfaces/jsonresponse';
import { CartResponse } from '../../model/interfaces/cart';
import { HttpHeaders } from '@angular/common/http';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let baseUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService, provideHttpClientTesting()]
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
    baseUrl = 'http://localhost:8080/cart/';
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add book to the cart', () => {
    const cart: Cart = {
      bookId: 34
    };
    const mockCartResponse: ResponseStructure<CartResponse> = {
      status: 200,
      message: 'Book added to cart successfully',
      data: {
        bookId: 34,
        cartId: 1,
        cartQuantity: 1
      }
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.addBookToCart(cart).subscribe({
      next: (response: ResponseStructure<CartResponse>) => {
        expect(response.status).toBe(200);
        expect(response.message).toBe('Book added to cart successfully');
        expect(response.data?.bookId).toBe(34);
        expect(response.data?.cartQuantity).toBe(1);
      },
      error: (error) => {
        fail('expected response in addToCart');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}addToCart`);
    expect(urlRequest.request.method).toBe('POST');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockCartResponse);
  });


  it('should handle the error from addToCart', () => {
    const cart: Cart = {
      bookId: 34
    };
    const mockCartResponse: ResponseStructure<CartResponse> = {
      status: 404,
      message: 'Book not found',
      data: null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.addBookToCart(cart).subscribe({
      next: (response: ResponseStructure<CartResponse>) => {
        fail('expected error in addToCart');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Book not found');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}addToCart`);
    expect(urlRequest.request.method).toBe('POST');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockCartResponse);
  });


  it('should remove a book from the cart', () => {
    const cartId: number = 1;
    const mockCartResponse: ResponseStructure<CartResponse> = {
      status: 200,
      message: 'Book removed from the cart successfully',
      data: null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.removeBookFromCart(cartId).subscribe({
      next: (response: ResponseStructure<CartResponse>) => {
        expect(response.status).toBe(200);
        expect(response.message).toBe('Book removed from the cart successfully');
      },
      error: (error) => {
        fail('expected response in removeFromCart');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}removeFromCart/${cartId}`);
    expect(urlRequest.request.method).toBe('DELETE');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockCartResponse);
  });


  it('should handle error from removeFromCart', () => {
    const cartId: number = 1;
    const mockCartResponse: ResponseStructure<CartResponse> = {
      status: 404,
      message: 'Cart not Found',
      data: null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.removeBookFromCart(cartId).subscribe({
      next: (response: ResponseStructure<CartResponse>) => {
        fail('expected error in removeFromCart');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Cart not found');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}removeFromCart/${cartId}`);
    expect(urlRequest.request.method).toBe('DELETE');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockCartResponse);
  });


  it('should fetch the user cart', () => {
    const mockCartResponse: ResponseStructure<CartResponse[]> = {
      status: 200,
      message: 'User cart fetched successfully',
      data: [{
        bookId: 34,
        cartId: 1,
        cartQuantity: 1
      },
      {
        bookId: 56,
        cartId: 2,
        cartQuantity: 2
      }]
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.getUserCart().subscribe({
      next: (response: ResponseStructure<CartResponse[]>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.message).toBe('User cart fetched successfully');
          expect(response.data[0].bookId).toBe(34);
          expect(response.data[1].bookId).toBe(56);
          expect(response.data[1].cartQuantity).toBe(2);
        }
      },
      error: (error) => {
        fail('expected response in getCart');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getCart`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockCartResponse);
  });


  it('should handle the error in getCart', () => {
    const mockCartResponse: ResponseStructure<CartResponse[]> = {
      status: 401,
      message: 'Unauthorized',
      data: null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.getUserCart().subscribe({
      next: (response: ResponseStructure<CartResponse[]>) => {
        fail('expected error in getCart');
      },
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.message).toBe('Unauthorized');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getCart`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockCartResponse);
  });
});
