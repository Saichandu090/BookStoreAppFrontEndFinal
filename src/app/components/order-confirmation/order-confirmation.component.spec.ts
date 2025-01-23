import { OrderService } from './../../services/order/order.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderConfirmationComponent } from './order-confirmation.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ResponseStructure } from '../../model/interfaces/jsonresponse';
import { OrderResponse } from '../../model/interfaces/order';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;
  let mockOrderService: jest.Mocked<OrderService>;
  let mockRouter: jest.Mocked<Router>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    mockOrderService = {
      getAllOrders: jest.fn()
    } as any;

    mockRouter = {
      navigateByUrl: jest.fn()
    } as any;

    mockSnackBar = {
      open: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [OrderConfirmationComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });

    fixture = TestBed.createComponent(OrderConfirmationComponent);
    component = fixture.componentInstance;
  });

  const mockOrderResponse:ResponseStructure<OrderResponse[]> = {
    status: 200,
    message:'Orders fetched',
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
      }
    ]
  };



  it('should initialize and fetch the last order successfully', () => {
    mockOrderService.getAllOrders.mockReturnValue(of(mockOrderResponse));
    fixture.detectChanges();
    expect(component.orderId).toBe(1);
    expect(component.address).toBe('Something, Baner, MH');
    expect(mockOrderService.getAllOrders).toHaveBeenCalled();
  });


  it('should handle empty order list', () => {
    const emptyResponse:ResponseStructure<OrderResponse[]> = {
      status: 200,
      message:'No content',
      data: []
    };
    mockOrderService.getAllOrders.mockReturnValue(of(emptyResponse));
    fixture.detectChanges();
    expect(component.orderId).toBeUndefined();
    expect(component.address).toBeUndefined();
  });


  it('should display snackbar on order retrieval error', () => {
    const errorResponse:ResponseStructure<OrderResponse[]> = {
      status: 500,
      message: 'Failed to fetch orders',
      data:null
    };
    mockOrderService.getAllOrders.mockReturnValue(throwError(() => errorResponse));
    fixture.detectChanges();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Failed to fetch orders', '', { duration: 3000 });
  });


  it('should navigate to homepage when continue method is called', () => {
    component.continue();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/homepage');
  });

  it('should have default email value', () => {
    expect(component.email).toBe('chandu45@gmail.com');
  });
});
