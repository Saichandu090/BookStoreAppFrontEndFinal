import { TestBed } from '@angular/core/testing';
import { WishlistService } from './wishlist.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { WishListRequest } from '../../model/classes/cart';
import { ResponseStructure, WishListResponse } from '../../model/interfaces/jsonresponse';
import { HttpHeaders } from '@angular/common/http';

describe('WishlistService', () => {
  let service: WishlistService;
  let httpMock: HttpTestingController;
  let baseUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WishlistService, provideHttpClientTesting()]
    });
    service = TestBed.inject(WishlistService);
    httpMock = TestBed.inject(HttpTestingController);
    baseUrl = 'http://localhost:8080/wishlist/';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should add book to wishlist', () => {
    const wishList: WishListRequest = {
      bookId: 37
    };
    const mockWishListResponse: ResponseStructure<WishListResponse> = {
      status: 201,
      message: 'Book added to wishlist successfully',
      data: {
        bookId: 34,
        wishListId: 1
      }
    };

    const mockHttpHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHttpHeaders);

    service.addToWishList(wishList).subscribe({
      next: (response: ResponseStructure<WishListResponse>) => {
        if (response.data) {
          expect(response.status).toBe(201);
          expect(response.message).toBe('Book added to wishlist successfully');
          expect(response.data.bookId).toBe(37);
        }
      },
      error: (error) => {
        fail('expected response in addToWishList');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}addToWishList`);
    expect(urlRequest.request.method).toBe('POST');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockWishListResponse);
  });


  it('should handle the error in addToWishList', () => {
    const wishList: WishListRequest = {
      bookId: 37
    };
    const mockWishListResponse: ResponseStructure<WishListResponse> = {
      status: 401,
      message: 'Unauthorized',
      data: null
    };

    const mockHttpHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHttpHeaders);

    service.addToWishList(wishList).subscribe({
      next: (response: ResponseStructure<WishListResponse>) => {
        fail('expected error in addToWishList');
      },
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.message).toBe('Unauthorized');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}addToWishList`);
    expect(urlRequest.request.method).toBe('POST');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockWishListResponse);
  });


  it('should fetch the user wishlist', () => {
    const mockWishListResponse: ResponseStructure<WishListResponse[]> = {
      status: 200,
      message: 'User wishlist fetched successfully',
      data: [
        {
          bookId: 34,
          wishListId: 1
        },
        {
          bookId: 37,
          wishListId: 2
        }
      ]
    };

    const mockHttpHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHttpHeaders);

    service.getWishList().subscribe({
      next: (response: ResponseStructure<WishListResponse[]>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.message).toBe('User wishlist fetched successfully');
          expect(response.data[0].bookId).toBe(34);
          expect(response.data[1].bookId).toBe(37);
        }
      },
      error: (error) => {
        fail('expected response in getWishList');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getWishList`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockWishListResponse);
  });


  it('should handle the error in getWishList', () => {
    const mockWishListResponse: ResponseStructure<WishListResponse[]> = {
      status: 401,
      message: 'Unauthorized',
      data: null
    };

    const mockHttpHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHttpHeaders);

    service.getWishList().subscribe({
      next: (response: ResponseStructure<WishListResponse[]>) => {
        fail('expected error in getWishList');
      },
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.message).toBe('Unauthorized');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getWishList`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockWishListResponse);
  });
});
