import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmationComponent } from './order-confirmation.component';
import { OrderService } from '../../services/order/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ResponseStructure } from '../../model/interfaces/jsonresponse';
import { OrderResponse } from '../../model/interfaces/order';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;
  let orderServiceMock: jest.Mocked<OrderService>;
  let snackBarMock: jest.Mocked<MatSnackBar>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    orderServiceMock = {
      getAllOrders: jest.fn(),
    } as any;

    snackBarMock = {
      open: jest.fn(),
    } as any;

    routerMock = {
      navigateByUrl: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [OrderConfirmationComponent, HttpClientTestingModule],
      providers: [provideHttpClientTesting(),
      { provide: OrderService, useValue: orderServiceMock },
      { provide: MatSnackBar, useValue: snackBarMock },provideAnimations()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and set orderId and address correctly when order is returned', () => {
    const mockOrderResponse: ResponseStructure<OrderResponse[]> = {
      status: 200,
      message: 'Orders retrieved successfully',
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
      ],
    };
    orderServiceMock.getAllOrders.mockReturnValue(of(mockOrderResponse));

    component.ngOnInit();

    expect(component.orderId).toBe(1);
    expect(component.address).toBe('123 Main St, Test City, Test State');
  });

  it('should call snackBar.open when there is an error fetching orders', () => {
    const mockErrorResponse = {
      status: 500,
      message: 'Failed to retrieve orders',
    };
    orderServiceMock.getAllOrders.mockReturnValue(throwError(() => mockErrorResponse));

    component.ngOnInit();

    expect(snackBarMock.open).toHaveBeenCalledWith('Failed to retrieve orders', '', { duration: 3000 });
  });

  it('should navigate to /homepage when continue() is called', () => {
    component.continue();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/homepage');
  });
});
