import { OrderService } from './../../services/order/order.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ResponseStructure } from '../../model/interfaces/jsonresponse';
import { OrderResponse } from '../../model/interfaces/order';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let mockOrderService: jest.Mocked<OrderService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  const mockOrderResponse: ResponseStructure<OrderResponse[]> = {
    status: 200,
    message: 'Orders fetched',
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

  beforeEach(async () => {
    mockOrderService = {
      getAllOrders: jest.fn(),
      cancelOrder: jest.fn(),
      onOrderChanged: {
        subscribe: jest.fn(),
        next: jest.fn()
      }
    } as any;

    mockSnackBar = {
      open: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
  });

  describe('getOrders', () => {
    it('should fetch orders successfully', () => {
      mockOrderService.getAllOrders.mockReturnValue(of(mockOrderResponse));
      component.getOrders();
      expect(mockOrderService.getAllOrders).toHaveBeenCalled();
      if (mockOrderResponse.data)
        expect(component.orderList).toEqual(mockOrderResponse.data);
    });

    it('should handle error when fetching orders', () => {
      const errorResponse:ResponseStructure<OrderResponse[]> = {
        status: 500,
        message: 'Error fetching orders',
        data:null
      };
      mockOrderService.getAllOrders.mockReturnValue(throwError(() => errorResponse));
      component.getOrders();
      expect(mockSnackBar.open).toHaveBeenCalledWith(errorResponse.message, '', { duration: 3000 });
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order when confirmed', () => {
      const mockCancelResponse:ResponseStructure<OrderResponse> = {
        status: 200,
        message: 'Order cancelled successfully',
        data:{
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
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      mockOrderService.cancelOrder.mockReturnValue(of(mockCancelResponse));
      component.cancelOrder(1);
      expect(window.confirm).toHaveBeenCalledWith('Do you want to cancel the order ?');
      expect(mockOrderService.cancelOrder).toHaveBeenCalledWith(1);
      expect(mockSnackBar.open).toHaveBeenCalledWith(mockCancelResponse.message, '', { duration: 3000 });
      expect(mockOrderService.onOrderChanged.next).toHaveBeenCalledWith(true);
    });

    it('should not cancel order when not confirmed', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);
      component.cancelOrder(1);
      expect(window.confirm).toHaveBeenCalledWith('Do you want to cancel the order ?');
      expect(mockOrderService.cancelOrder).not.toHaveBeenCalled();
    });

    it('should handle error when cancelling order', () => {
      const errorResponse:ResponseStructure<OrderResponse> = {
        status: 500,
        message: 'Error cancelling order',
        data:null
      };
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      mockOrderService.cancelOrder.mockReturnValue(throwError(() => errorResponse));
      component.cancelOrder(1);
      expect(mockSnackBar.open).toHaveBeenCalledWith(errorResponse.message, '', { duration: 3000 });
    });
  });
});
