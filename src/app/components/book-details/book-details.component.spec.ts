import { BooksService } from './../../services/books/books.service';
import { WishlistService } from './../../services/wishList/wishlist.service';
import { CartService } from './../../services/cart/cart.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookDetailsComponent } from './book-details.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';
import { BookResponse, ResponseStructure, WishListResponse } from '../../model/interfaces/jsonresponse';
import { CartResponse } from '../../model/interfaces/cart';

describe('BookDetailsComponent', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;
  let mockCartService: jest.Mocked<CartService>;
  let mockWishlistService: jest.Mocked<WishlistService>;
  let mockBooksService: jest.Mocked<BooksService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;
  let mockActivatedRoute: { snapshot: { paramMap: { get: jest.Mock } } };

  beforeEach(async () => {
    mockCartService = {
      addBookToCart: jest.fn(),
      getUserCart: jest.fn(),
      removeBookFromCart: jest.fn(),
      onCartCalled: { next: jest.fn(), pipe: jest.fn().mockReturnValue(of(true)) }
    } as any;

    mockWishlistService = {
      addToWishList: jest.fn(),
      getWishList: jest.fn(),
      onWishListChanged: { next: jest.fn(), subscribe: jest.fn() }
    } as any;

    mockBooksService = {
      getBookById: jest.fn()
    } as any;

    mockSnackBar = {
      open: jest.fn()
    } as any;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('123')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [BookDetailsComponent, HttpClientTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: WishlistService, useValue: mockWishlistService },
        { provide: BooksService, useValue: mockBooksService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }, provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailsComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should fetch book and cart details successfully', () => {
      const mockBookResponse: ResponseStructure<BookResponse> = {
        status: 200,
        message: 'Book fetched',
        data: {
          bookId: 1,
          bookName: 'Book',
          bookAuthor: 'Author',
          bookDescription: 'Description',
          bookPrice: 199.9,
          bookLogo: 'Url',
          bookQuantity: 60
        }
      };
      const mockCartResponse: ResponseStructure<CartResponse[]> = {
        status: 200,
        message: "Cart fetched",
        data: [
          {
            bookId: 1,
            cartQuantity: 2,
            cartId: 1
          }
        ]
      };
      const mockResponse:ResponseStructure<WishListResponse[]> = {
        status: 201,
        message: 'Book added to wishlist',
        data:[{
          bookId:12,
          wishListId:1
        }]
      };
      mockWishlistService.getWishList.mockReturnValue(of(mockResponse));
      mockBooksService.getBookById.mockReturnValue(of(mockBookResponse));
      mockCartService.getUserCart.mockReturnValue(of(mockCartResponse));
      fixture.detectChanges();
      if (mockBookResponse.data)
        expect(component.book).toEqual(mockBookResponse.data);
      expect(component.cartQuantity).toBe(2);
    });

    it('should handle errors when fetching book, cart, and wishlist', () => {
      mockBooksService.getBookById.mockReturnValue(throwError(() => new Error('Book fetch error')));
      mockCartService.getUserCart.mockReturnValue(throwError(() => new Error('Cart error')));
      mockWishlistService.getWishList.mockReturnValue(throwError(() => new Error('Wishlist error')));
      fixture.detectChanges();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Error loading book or cart', '', { duration: 3000 });
    });
  });

  describe('addToCart', () => {
    it('should add book to cart successfully', () => {
      const mockCartResponse: ResponseStructure<CartResponse> = {
        status: 200,
        message: "Book added to cart",
        data: {
          bookId: 1,
          cartQuantity: 2,
          cartId: 1
        }
      };
      mockCartService.addBookToCart.mockReturnValue(of(mockCartResponse));
      component.addToCart(1);
      expect(mockCartService.addBookToCart).toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith(mockCartResponse.message, '', { duration: 3000 });
      expect(mockCartService.onCartCalled.next).toHaveBeenCalledWith(true);
    });


    it('should handle cart addition with status 209', () => {
      const mockResponse: ResponseStructure<CartResponse> = {
        status: 209,
        data: null,
        message: 'Book already in cart'
      };
      mockCartService.addBookToCart.mockReturnValue(of(mockResponse));
      component.addToCart(123);
      expect(mockSnackBar.open).toHaveBeenCalledWith(mockResponse.message);
    });
  });

  describe('addToWishList', () => {
    it('should add book to wishlist successfully', () => {
      const mockResponse:ResponseStructure<WishListResponse> = {
        status: 201,
        message: 'Book added to wishlist',
        data:{
          bookId:12,
          wishListId:1
        }
      };
      mockWishlistService.addToWishList.mockReturnValue(of(mockResponse));
      component.addToWishList(12);
      expect(mockWishlistService.addToWishList).toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith(mockResponse.message, '', { duration: 3000 });
      expect(mockWishlistService.onWishListChanged.next).toHaveBeenCalledWith(true);
    });
  });

  describe('isBookPresent', () => {
    it('should return true if book is in wishlist', () => {
      component.wishListBooks = [
        { bookId: 12, wishListId: 1 },
        { bookId: 456, wishListId: 2 }
      ];
      expect(component.isBookPresent(12)).toBe(true);
      expect(component.isBookPresent(789)).toBe(false);
    });
  });
});
