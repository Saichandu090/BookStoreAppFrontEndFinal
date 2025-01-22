import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderRequest, OrderResponse } from '../../model/interfaces/order';
import { AddressResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { HttpHeaders } from '@angular/common/http';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  let baseUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService, provideHttpClientTesting()]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
    baseUrl = 'http://localhost:8080/order/';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an order', () => {
    const order: OrderRequest = {
      addressId: 2
    };
    const mockOrderResponse: ResponseStructure<OrderResponse> = {
      status: 201,
      message: 'Order placed successfully',
      data: {
        orderId: 1,
        cancelOrder: false,
        orderDate: '2025-1-22',
        orderPrice: 234.45,
        orderQuantity: 1,
        orderAddress: {
          addressId: 1,
          city: 'Baner',
          state: 'MH',
          pinCode: 450989,
          streetName: 'Something'
        },
        orderBooks: [{
          bookId: 345,
          bookAuthor: 'Chandu',
          bookName: 'Atom Bomb',
          bookDescription: 'Chemistry',
          bookLogo: 'URL',
          bookPrice: 234.45,
          bookQuantity: 1
        }]
      }
    };


    const mockHttpHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHttpHeaders);

    service.placeOrder(order).subscribe({
      next: (response: ResponseStructure<OrderResponse>) => {
        if (response.data) {
          expect(response.status).toBe(201);
          expect(response.data.cancelOrder).toBe(false);
          expect(response.data.orderBooks.length).toBe(1);
          expect(response.data.orderBooks[0].bookId).toBe(345);
          expect(response.data.orderAddress.city).toBe('MH');
        }
      },
      error: (error) => {
        fail('expected response in placeOrder');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}placeOrder`);
    expect(urlRequest.request.method).toBe('POST');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockOrderResponse);
  });


  it('should handle an error in placeOrder', () => {
    const order: OrderRequest = {
      addressId: 2
    };
    const mockOrderResponse: ResponseStructure<OrderResponse> = {
      status: 401,
      message: 'Unauthorized',
      data: null
    }

    const mockHttpHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHttpHeaders);

    service.placeOrder(order).subscribe({
      next: (response: ResponseStructure<OrderResponse>) => {
        fail('expected error in placeOrder');
      },
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.message).toBe('Unauthorized');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}placeOrder`);
    expect(urlRequest.request.method).toBe('POST');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockOrderResponse);
  });


  it('should cancel an order successfully', () => {
    const orderId:number=1;
    const mockOrderResponse: ResponseStructure<OrderResponse> = {
      status: 200,
      message: 'Order cancelled successfully',
      data: {
        orderId: 1,
        cancelOrder: true,
        orderDate: '2025-1-22',
        orderPrice: 234.45,
        orderQuantity: 1,
        orderAddress: {
          addressId: 1,
          city: 'Baner',
          state: 'MH',
          pinCode: 450989,
          streetName: 'Something'
        },
        orderBooks: [{
          bookId: 345,
          bookAuthor: 'Chandu',
          bookName: 'Atom Bomb',
          bookDescription: 'Chemistry',
          bookLogo: 'URL',
          bookPrice: 234.45,
          bookQuantity: 1
        }]
      }
    };

    const mockHttpHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHttpHeaders);

    service.cancelOrder(orderId).subscribe({
      next: (response: ResponseStructure<OrderResponse>) => {
        expect(response.status).toBe(200);
        expect(response.data?.cancelOrder).toBe(true);
        expect(response.data?.orderId).toBe(1);
      },
      error: (error) => {
        fail('expected response in cancelOrder');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}cancelOrder/${orderId}`);
    expect(urlRequest.request.method).toBe('DELETE');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockOrderResponse);
  });


  it('should handle the error in cancelOrder', () => {
    const orderId:number=1;
    const mockOrderResponse: ResponseStructure<OrderResponse> = {
      status: 404,
      message: 'Order not found',
      data: null
    }

    const mockHttpHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHttpHeaders);

    service.cancelOrder(orderId).subscribe({
      next: (response: ResponseStructure<OrderResponse>) => {
        fail('expected error in cancelOrder');
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Order not found');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}cancelOrder/${orderId}`);
    expect(urlRequest.request.method).toBe('DELETE');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockOrderResponse);
  });


  it('should fetch all the user orders', () => {
    const mockOrderResponse: ResponseStructure<OrderResponse[]> = {
      status: 200,
      message: 'User orders fetched successfully',
      data: [
        {
          orderId: 1,
          cancelOrder: false,
          orderDate: '2025-1-22',
          orderPrice: 234.45,
          orderQuantity: 1,
          orderAddress: {
            addressId: 1,
            city: 'Baner',
            state: 'MH',
            pinCode: 450989,
            streetName: 'Something'
          },
          orderBooks: [{
            bookId: 345,
            bookAuthor: 'Chandu',
            bookName: 'Atom Bomb',
            bookDescription: 'Chemistry',
            bookLogo: 'URL',
            bookPrice: 234.45,
            bookQuantity: 1
          }]
        },
        {
          orderId: 2,
          cancelOrder: true,
          orderDate: '2025-1-22',
          orderPrice: 99.45,
          orderQuantity: 1,
          orderAddress: {
            addressId: 1,
            city: 'Chittoor',
            state: 'AP',
            pinCode: 517127,
            streetName: 'anything'
          },
          orderBooks: [{
            bookId: 37,
            bookAuthor: 'Zac',
            bookName: 'Book Zac',
            bookDescription: 'Physics',
            bookLogo: 'URL 2',
            bookPrice: 99.45,
            bookQuantity: 1
          }]
        }
      ]
    }

    const mockHttpHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHttpHeaders);

    service.getOrders().subscribe({
      next: (response: ResponseStructure<OrderResponse[]>) => {
        if(response.data){
          expect(response.status).toBe(200);
          expect(response.data[0].cancelOrder).toBe(false);
          expect(response.data[1].cancelOrder).toBe(true);
          expect(response.data.length).toBe(2);
        }

      },
      error: (error) => {
        fail('expected response in getAllOrders');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getAllOrders`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockOrderResponse);
  });


  it('should handle the error in getAllOrders', () => {
    const mockOrderResponse: ResponseStructure<OrderResponse[]> = {
      status: 401,
      message: 'Unauthorized',
      data: null
    }
    const mockHttpHeaders = new HttpHeaders().set('Authorization', 'Bearer token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHttpHeaders);

    service.getOrders().subscribe({
      next: (response: ResponseStructure<OrderResponse[]>) => {
        fail('expected error in getAllOrders');
      },
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.message).toBe('Unauthorized');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getAllOrders`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer token');
    urlRequest.flush(mockOrderResponse);
  });
});
