import { OrderService } from './../../services/order/order.service';
import { AddressService } from './../../services/address/address.service';
import { BooksService } from './../../services/books/books.service';
import { CartService } from './../../services/cart/cart.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOrderComponent } from './create-order.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressResponse, BookResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { CartResponse } from '../../model/interfaces/cart';
import { Address } from '../../model/classes/cart';
import { OrderResponse } from '../../model/interfaces/order';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('CreateOrderComponent', () => {
  let component: CreateOrderComponent;
  let fixture: ComponentFixture<CreateOrderComponent>;
  let mockCartService: jest.Mocked<CartService>;
  let mockBooksService: jest.Mocked<BooksService>;
  let mockAddressService: jest.Mocked<AddressService>;
  let mockOrderService: jest.Mocked<OrderService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;
  let mockRouter: jest.Mocked<Router>;
  let mockDialog: jest.Mocked<MatDialog>;

  beforeEach(() => {
    mockCartService = {
      getUserCart: jest.fn(),
      addBookToCart: jest.fn(),
      removeBookFromCart: jest.fn(),
      onCartCalled: {
        next: jest.fn(),
        subscribe: jest.fn()
      }
    } as any;

    mockBooksService = {
      getBookById: jest.fn(),
      onBookChanged: {
        next: jest.fn()
      }
    } as any;

    mockAddressService = {
      getAllAddress: jest.fn(),
      getAddressById: jest.fn(),
      editAddress: jest.fn(),
      deleteAddress: jest.fn(),
      onAddressChange: {
        next: jest.fn(),
        subscribe: jest.fn()
      }
    } as any;

    mockOrderService = {
      placeOrder: jest.fn()
    } as any;

    mockSnackBar = {
      open: jest.fn()
    } as any;

    mockRouter = {
      navigateByUrl: jest.fn()
    } as any;

    mockDialog = {
      open: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [CreateOrderComponent, ReactiveFormsModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: BooksService, useValue: mockBooksService },
        { provide: AddressService, useValue: mockAddressService },
        { provide: OrderService, useValue: mockOrderService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },provideAnimations()
      ]
    });

    fixture = TestBed.createComponent(CreateOrderComponent);
    component = fixture.componentInstance;
  });


  const mockCartResponse: ResponseStructure<CartResponse[]> = {
    status: 200,
    message:'Cart fetched',
    data: [
      {
        cartId: 1,
        bookId: 101,
        cartQuantity: 2
      }
    ]
  };

  const mockBookResponse: ResponseStructure<BookResponse> = {
    status: 200,
    message:'Book fetched',
    data: {
      bookId: 101,
      bookName: 'Test Book',
      bookPrice: 19.99,
      bookLogo: 'Url',
      bookAuthor: 'Testing king',
      bookDescription: 'Testable',
      bookQuantity: 20
    }
  };

  const mockAddressResponse: ResponseStructure<AddressResponse[]> = {
    status: 200,
    message:'User address fetched',
    data: [
      {
        addressId: 1,
        streetName: 'Baner',
        city: 'Pune',
        state: 'Maharastra',
        pinCode: 12345
      }
    ]
  };

  describe('Positive Scenarios', () => {

    it('should load user cart successfully', () => {
      mockAddressService.getAllAddress.mockReturnValue(of(mockAddressResponse));
      mockCartService.getUserCart.mockReturnValue(of(mockCartResponse));
      mockBooksService.getBookById.mockReturnValue(of(mockBookResponse));
      fixture.detectChanges();
      expect(mockCartService.getUserCart).toHaveBeenCalled();
      expect(component.cartData.length).toBe(1);
      expect(component.totalQuantity).toBe(2);
      expect(component.totalPrice).toBe(39.98);
    });


    it('should load user addresses successfully', () => {
      mockCartService.getUserCart.mockReturnValue(of(mockCartResponse));
      mockAddressService.getAllAddress.mockReturnValue(of(mockAddressResponse));
      fixture.detectChanges();
      expect(mockAddressService.getAllAddress).toHaveBeenCalled();
      expect(component.addressList.length).toBe(1);
      expect(component.addressList[0].city).toBe('Pune');
    });


    it('should add book to cart successfully', () => {
      const successResponse: ResponseStructure<CartResponse> = {
        status: 200,
        message: 'Book added to cart',
        data: {} as CartResponse
      };
      mockCartService.addBookToCart.mockReturnValue(of(successResponse));
      component.onAddToCart(101);
      expect(mockCartService.addBookToCart).toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith(successResponse.message, '', { duration: 3000 });
      expect(mockCartService.onCartCalled.next).toHaveBeenCalledWith(true);
    });


    it('should remove book from cart successfully', () => {
      component.cartData = [{
        cartId: 1,
        bookId: 101,
        quantity: 1,
        bookName: 'Test Book',
        bookPrice: 19.99,
        bookLogo: 'url',
        totalPrice: 19.99
      }];
      const successResponse: ResponseStructure<CartResponse> = {
        status: 200,
        message: 'Book removed from cart',
        data: {} as CartResponse
      };
      mockCartService.removeBookFromCart.mockReturnValue(of(successResponse));
      component.onRemoveFromCart(1);
      expect(mockCartService.removeBookFromCart).toHaveBeenCalledWith(1);
      expect(component.cartData.length).toBe(0);
      expect(mockSnackBar.open).toHaveBeenCalledWith(successResponse.message, '', { duration: 3000 });
    });


    it('should place order successfully', () => {
      component.totalQuantity = 2;
      component.addressControl = new FormControl('1',[Validators.required]);
      component.selectedAddress = { addressId: 1 } as Address;
      const successResponse: ResponseStructure<OrderResponse> = {
        status: 201,
        message: 'Order placed successfully',
        data: {} as OrderResponse
      };
      mockOrderService.placeOrder.mockReturnValue(of(successResponse));
      component.onPlaceOrder();
      expect(mockOrderService.placeOrder).toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith(successResponse.message, '', { duration: 3000 });
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/order-placed');
    });
  });



  describe('Negative Scenarios', () => {
    it('should handle cart loading error', () => {
      const errorResponse = {
        status: 400,
        message: 'Bad request',
        data:null
      };
      mockAddressService.getAllAddress.mockReturnValue(of(mockAddressResponse));
      mockCartService.getUserCart.mockReturnValue(throwError(() => errorResponse));
      fixture.detectChanges();
      expect(mockSnackBar.open).toHaveBeenCalledWith(errorResponse.message, '', { duration: 3000 });
    });



    it('should handle add to cart failure', () => {
      const errorResponse: ResponseStructure<CartResponse> = {
        status: 400,
        message: 'Bad request',
        data:null
      };
      mockCartService.addBookToCart.mockReturnValue(throwError(() => errorResponse));
      component.onAddToCart(101);
      expect(mockSnackBar.open).toHaveBeenCalledWith(errorResponse.message, '', { duration: 3000 });
    });


    it('should handle remove from cart failure', () => {
      const errorResponse: ResponseStructure<CartResponse> = {
        status: 400,
        message: 'Bad request',
        data:null
      };
      mockCartService.removeBookFromCart.mockReturnValue(throwError(() => errorResponse));
      component.onRemoveFromCart(1);
      expect(mockSnackBar.open).toHaveBeenCalledWith(errorResponse.message, '', { duration: 3000 });
    });


    it('should prevent order placement without address', () => {
      component.addressControl = new FormControl('',[Validators.required]);
      component.totalQuantity = 2;
      component.onPlaceOrder();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Please select atleast one address', '', { duration: 3000 });
    });


    it('should prevent order placement with empty cart', () => {
      component.addressControl = new FormControl('');
      component.totalQuantity = 0;
      component.onPlaceOrder();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Please add atleast one book to place order :)', '', { duration: 3000 });
    });


    it('should handle order placement failure', () => {
      component.totalQuantity = 2;
      component.addressControl = new FormControl('1',[Validators.required]);
      component.selectedAddress = { addressId: 1 } as Address;
      const errorResponse: ResponseStructure<OrderResponse> = {
        status: 500,
        message: 'Failed to place order',
        data:null
      };
      mockOrderService.placeOrder.mockReturnValue(throwError(() => errorResponse));
      component.onPlaceOrder();
      expect(mockSnackBar.open).toHaveBeenCalledWith(errorResponse.message, '', { duration: 3000 });
    });
  });
});
