import { TestBed } from '@angular/core/testing';
import { AddressService } from './address.service';
import { HttpTestingController, provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';
import { Address, AddressRequest } from '../../model/classes/cart';
import { AddressResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { HttpHeaders } from '@angular/common/http';

describe('AddressService', () => {
  let service: AddressService;
  let httpMock: HttpTestingController;
  let baseUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddressService, provideHttpClientTesting()]
    });
    service = TestBed.inject(AddressService);
    httpMock = TestBed.inject(HttpTestingController);
    baseUrl = 'http://localhost:8080/address/';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should add an address successfully', () => {
    const address: AddressRequest = {
      streetName: 'Baner',
      city: 'Pune',
      pinCode: 414004,
      state: 'Maharastra'
    };

    const mockAddressResponse: ResponseStructure<AddressResponse> = {
      status: 201,
      message: 'Address added successfully',
      data: {
        addressId: 1,
        streetName: 'Baner',
        pinCode: 414004,
        city: 'Pune',
        state: 'Maharastra'
      }
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.addAddress(address).subscribe({
      next: (response: ResponseStructure<AddressResponse>) => {
        if (response.data) {
          expect(response.status).toBe(201);
          expect(response.message).toBe('Address added successfully');
          expect(response.data.addressId).toBe(1);
        }
      },
      error: (error) => {
        fail('expected response in addAddress');
      }
    });

    const urlRequest = httpMock.expectOne(baseUrl + 'addAddress');
    expect(urlRequest.request.method).toBe('POST');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockAddressResponse);
  });


  it('should handle an address add request', () => {
    const address: AddressRequest = {
      streetName: 'Baner',
      city: 'Pune',
      pinCode: 414004,
      state: 'Maharastra'
    };

    const mockAddressResponse: ResponseStructure<AddressResponse> = {
      status: 401,
      message: 'Unauthorized',
      data: null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.addAddress(address).subscribe({
      next: (response: ResponseStructure<AddressResponse>) => {
        if (response.data) {
          fail('expected error in addAddress');
        }
      },
      error: (error) => {
        expect(error.status).toBe(401);
        expect(error.message).toBe('Unauthorized');
      }
    });

    const urlRequest = httpMock.expectOne(baseUrl + 'addAddress');
    expect(urlRequest.request.method).toBe('POST');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockAddressResponse);
  });


  it('should get an address by id given', () => {
    const addressId: number = 1;
    const mockAddressResponse: ResponseStructure<AddressResponse> = {
      status: 200,
      message: 'Address fetched successfully',
      data: {
        addressId: 1,
        streetName: 'Baner',
        pinCode: 414004,
        city: 'Pune',
        state: 'Maharastra'
      }
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.getAddressById(addressId).subscribe({
      next: (response: ResponseStructure<AddressResponse>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.message).toBe('Address fetched successfully');
          expect(response.data.addressId).toBe(1);
          expect(response.data.streetName).toBe('Baner');
        }
      },
      error: (error) => {
        fail('expected response in getAddressById');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getAddressById/${addressId}`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockAddressResponse);
  });


  it('should handle the error for getAddressById', () => {
    const addressId: number = 1;
    const mockAddressResponse: ResponseStructure<AddressResponse> = {
      status: 404,
      message: 'Address not found',
      data: null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.getAddressById(addressId).subscribe({
      next: (response: ResponseStructure<AddressResponse>) => {
        if (response.data) {
          fail('expected error in getAddressById');
        }
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Address not found');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}getAddressById/${addressId}`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockAddressResponse);
  });


  it('should return 2 address', () => {
    const mockAddressResponse: ResponseStructure<AddressResponse[]> = {
      status: 200,
      message: 'Addresses fetched successfully',
      data: [
        {
          addressId: 1,
          streetName: 'Baner',
          pinCode: 414004,
          city: 'Pune',
          state: 'Maharastra'
        },
        {
          addressId: 2,
          streetName: 'Test',
          pinCode: 517127,
          city: 'Chittoor',
          state: 'Andhra'
        }
      ]
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.getAllAddress().subscribe({
      next: (response: ResponseStructure<AddressResponse[]>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.data.length).toBe(2);
          expect(response.message).toBe('Addresses fetched successfully');
          expect(response.data[0].addressId).toBe(1);
          expect(response.data[0].streetName).toBe('Baner');
          expect(response.data[1].addressId).toBe(2);
          expect(response.data[1].streetName).toBe('Test');
        }
      },
      error: (error) => {
        fail('expected response in getAllAddress');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}allAddress`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockAddressResponse);
  });


  it('should give No-Content', () => {
    const addressId: number = 1;
    const mockAddressResponse: ResponseStructure<AddressResponse[]> = {
      status: 209,
      message: 'No address found',
      data:null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.getAllAddress().subscribe({
      next: (response: ResponseStructure<AddressResponse[]>) => {
        if (response.data) {
          expect(response.status).toBe(209);
          expect(response.message).toBe('No address found');
        }
      },
      error: (error) => {
        fail('expected response in getAllAddress');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}allAddress`);
    expect(urlRequest.request.method).toBe('GET');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockAddressResponse);
  });


  it('should edit an address successfully', () => {
    const addressId:number=1;
    const address: AddressRequest = {
      streetName: 'Baner',
      city: 'Pune',
      pinCode: 414004,
      state: 'Maharastra'
    };

    const mockAddressResponse: ResponseStructure<AddressResponse> = {
      status: 200,
      message: 'Address updated successfully',
      data: {
        addressId: 1,
        streetName: 'Baner',
        pinCode: 414004,
        city: 'Pune',
        state: 'Maharastra'
      }
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.editAddress(addressId,address).subscribe({
      next: (response: ResponseStructure<AddressResponse>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.message).toBe('Address updated successfully');
          expect(response.data.addressId).toBe(1);
          expect(response.data.city).toBe('Pune');
        }
      },
      error: (error) => {
        fail('expected response in editAddress');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}editAddress/${addressId}`);
    expect(urlRequest.request.method).toBe('PUT');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockAddressResponse);
  });


  it('should handle the error for editAddress', () => {
    const addressId:number=1;
    const address: AddressRequest = {
      streetName: 'Baner',
      city: 'Pune',
      pinCode: 414004,
      state: 'Maharastra'
    };

    const mockAddressResponse: ResponseStructure<AddressResponse> = {
      status: 404,
      message: 'Address not found',
      data: null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.editAddress(addressId,address).subscribe({
      next: (response: ResponseStructure<AddressResponse>) => {
        if (response.data) {
          fail('expected error in editAddress');
        }
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Address not found');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}editAddress/${addressId}`);
    expect(urlRequest.request.method).toBe('PUT');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockAddressResponse);
  });


  it('should delete an address successfully', () => {
    const addressId:number=1;
    const mockAddressResponse: ResponseStructure<string> = {
      status: 200,
      message: 'Address deleted successfully',
      data: null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.deleteAddress(addressId).subscribe({
      next: (response: ResponseStructure<string>) => {
        if (response.data) {
          expect(response.status).toBe(200);
          expect(response.message).toBe('Address deleted successfully');
        }
      },
      error: (error) => {
        fail('expected response in deleteAddress');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}deleteAddress/${addressId}`);
    expect(urlRequest.request.method).toBe('DELETE');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockAddressResponse);
  });


  it('should handle an error for deleteAddress', () => {
    const addressId:number=1;
    const mockAddressResponse: ResponseStructure<string> = {
      status: 404,
      message: 'Address not found',
      data: null
    };

    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer mock-token');
    jest.spyOn(service, 'getHeaders').mockReturnValue(mockHeaders);

    service.deleteAddress(addressId).subscribe({
      next: (response: ResponseStructure<string>) => {
        if (response.data) {
          fail('expected error in deleteAddress')
        }
      },
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Address not found');
      }
    });

    const urlRequest = httpMock.expectOne(`${baseUrl}deleteAddress/${addressId}`);
    expect(urlRequest.request.method).toBe('DELETE');
    expect(urlRequest.request.headers.get('Authorization')).toBe('Bearer mock-token');
    urlRequest.flush(mockAddressResponse);
  });
});
