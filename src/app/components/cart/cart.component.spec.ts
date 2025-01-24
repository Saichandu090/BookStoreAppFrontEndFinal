import { RouterTestingModule } from '@angular/router/testing';
import { BooksService } from './../../services/books/books.service';
import { CartService } from './../../services/cart/cart.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { BookResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { CartResponse } from '../../model/interfaces/cart';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jest.Mocked<CartService>;
  let mockBooksService: jest.Mocked<BooksService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    mockCartService = {
      getUserCart: jest.fn(),
      removeBookFromCart: jest.fn(),
      addBookToCart: jest.fn(),
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

    mockSnackBar = {
      open: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [CartComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: BooksService, useValue: mockBooksService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });


  const mockCartResponse: ResponseStructure<CartResponse[]> = {
    status: 200,
    message: 'Cart fetched',
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
    message: 'Book fetched',
    data: {
      bookId: 101,
      bookName: 'Test Book',
      bookPrice: 10.99,
      bookLogo: 'test-logo.jpg',
      bookAuthor: 'Test',
      bookDescription: 'Testing',
      bookQuantity: 123
    }
  };


  it('should load cart items on initialization', () => {
    mockCartService.getUserCart.mockReturnValue(of(mockCartResponse));
    mockBooksService.getBookById.mockReturnValue(of(mockBookResponse));
    fixture.detectChanges();
    expect(mockCartService.getUserCart).toHaveBeenCalled();
    expect(component.cartData.length).toBe(1);
    expect(component.totalQuantity).toBe(2);
    expect(component.totalPrice).toBe(21.98);
  });


  it('should handle cart items loading error', () => {
    const errorResponse: ResponseStructure<CartResponse[]> = {
      status: 500,
      message: 'Failed to load cart',
      data: null
    };
    mockCartService.getUserCart.mockReturnValue(throwError(() => errorResponse));
    fixture.detectChanges();
    expect(mockSnackBar.open).toHaveBeenCalledWith(errorResponse.message, '', { duration: 3000 });
  });


  it('should remove item from cart when quantity is 1', () => {
    component.cartData = [{
      cartId: 1,
      bookId: 101,
      bookName: 'Test Book',
      bookPrice: 10.99,
      quantity: 1,
      bookLogo: 'test-logo.jpg',
      totalPrice: 10.99
    }];
    const successResponse: ResponseStructure<CartResponse> = {
      status: 200,
      message: 'Item removed successfully',
      data: null
    };
    mockCartService.removeBookFromCart.mockReturnValue(of(successResponse));
    component.onRemoveFromCart(1);
    expect(component.cartData.length).toBe(0);
    expect(mockSnackBar.open).toHaveBeenCalledWith(successResponse.message, '', { duration: 3000 });
    expect(mockCartService.onCartCalled.next).toHaveBeenCalledWith(true);
    expect(mockBooksService.onBookChanged.next).toHaveBeenCalledWith(true);
  });


  it('should add book to cart successfully', () => {
    const successResponse: ResponseStructure<CartResponse> = {
      status: 200,
      message: 'Book added to cart',
      data: {
        bookId: 101,
        cartId: 1,
        cartQuantity: 1
      }
    };
    mockCartService.addBookToCart.mockReturnValue(of(successResponse));
    component.onAddToCart(101);
    expect(mockCartService.addBookToCart).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith(successResponse.message, '', { duration: 3000 });
    expect(mockCartService.onCartCalled.next).toHaveBeenCalledWith(true);
  });


  it('should handle adding an already existing item to cart', () => {
    const existingItemResponse: ResponseStructure<CartResponse> = {
      status: 200,
      message: 'Book added to cart',
      data: {
        bookId: 101,
        cartId: 1,
        cartQuantity: 2
      }
    };
    mockCartService.addBookToCart.mockReturnValue(of(existingItemResponse));
    component.onAddToCart(101);
    expect(mockSnackBar.open).toHaveBeenCalledWith(existingItemResponse.message, '', { duration: 3000 });
  });


  it('should display book out of stock', () => {
    const existingItemResponse: ResponseStructure<CartResponse> = {
      status: 209,
      message: 'Book out of stock',
      data: null
    };
    mockCartService.addBookToCart.mockReturnValue(of(existingItemResponse));
    component.onAddToCart(101);
    expect(mockSnackBar.open).toHaveBeenCalledWith(existingItemResponse.message, '', { duration: 3000 });
  });


  it('should correctly update totals', () => {
    component.cartData = [
      {
        cartId: 1,
        bookId: 101,
        quantity: 2,
        totalPrice: 21.98,
        bookPrice: 10.99,
        bookName: 'Test Book',
        bookLogo: 'test-logo.jpg'
      }
    ];
    component.updateTotals();
    expect(component.totalQuantity).toBe(2);
    expect(component.totalPrice).toBe(21.98);
  });


  it('should toggle cart popup visibility', () => {
    const initialState = component.isPopUpOpen;
    component.showCartPopUp();
    expect(component.isPopUpOpen).toBe(!initialState);
  });
});
