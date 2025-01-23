import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart/cart.service';
import { BooksService } from '../../services/books/books.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseStructure } from '../../model/interfaces/jsonresponse';
import { CartD, CartResponse } from '../../model/interfaces/cart';
import { of, Observable } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceMock: jest.Mocked<CartService>;
  let booksServiceMock: jest.Mocked<BooksService>;
  let matSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    cartServiceMock = {
      getUserCart: jest.fn(),
      addBookToCart: jest.fn(),
      removeBookFromCart: jest.fn(),
      onCartCalled: {
        next: jest.fn()
      }
    } as any;

    booksServiceMock = {
      getBookById: jest.fn(),
      onBookChanged: {
        next: jest.fn()
      }
    } as any;

    matSnackBar = {
      open: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CartComponent],
      declarations: [],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: BooksService, useValue: booksServiceMock },
        { provide: MatSnackBar, useValue: matSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call onAddToCart and show snackbar message on success', () => {
    const mockAddToCartResponse: ResponseStructure<CartResponse> = {
      status: 200,
      message: 'Book added to cart successfully',
      data: {
        cartId: 1,
        bookId: 1,
        cartQuantity: 2
      },
    };
    cartServiceMock.addBookToCart.mockReturnValue(of(mockAddToCartResponse));

    component.onAddToCart(1);

    expect(cartServiceMock.addBookToCart).toHaveBeenCalledWith({ bookId: 1 });
    expect(matSnackBar.open).toHaveBeenCalledWith('Book added to cart successfully', '', { duration: 3000 });
    expect(cartServiceMock.onCartCalled.next).toHaveBeenCalledWith(true);
  });

  it('should call onRemoveFromCart and update cart when item is removed', () => {
    const mockCartData: CartD[] = [
      {
        cartId: 1,
        bookId: 1,
        bookName: 'Test Book',
        quantity: 2,
        totalPrice: 200,
        bookPrice: 100,
        bookLogo: 'Url'
      },
    ];
    const mockRemoveResponse: ResponseStructure<CartResponse> = {
      status: 200,
      message: 'Book removed from cart successfully',
      data: {
        cartId: 1,
        bookId: 1,
        cartQuantity: 1
      },
    };

    component.cartData = mockCartData;
    cartServiceMock.removeBookFromCart.mockReturnValue(of(mockRemoveResponse));

    component.onRemoveFromCart(1);   

    expect(cartServiceMock.removeBookFromCart).toHaveBeenCalledWith(1);
    expect(component.cartData.length).toBe(0);
    expect(matSnackBar.open).toHaveBeenCalledWith('Book removed from cart successfully', '', { duration: 3000 });
  });
});
