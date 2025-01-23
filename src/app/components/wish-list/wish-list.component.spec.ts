import { CartService } from './../../services/cart/cart.service';
import { BooksService } from './../../services/books/books.service';
import { WishlistService } from './../../services/wishList/wishlist.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WishListComponent } from './wish-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { CartResponse } from '../../model/interfaces/cart';
import { BookResponse, ResponseStructure, WishListResponse } from '../../model/interfaces/jsonresponse';

describe('WishListComponent', () => {
  let component: WishListComponent;
  let fixture: ComponentFixture<WishListComponent>;
  let mockWishlistService: jest.Mocked<WishlistService>;
  let mockBooksService: jest.Mocked<BooksService>;
  let mockCartService: jest.Mocked<CartService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;


  const mockWishListResponse: ResponseStructure<WishListResponse[]> = {
    status: 200,
    data: [
      { bookId: 1, wishListId: 1 },
      { bookId: 2, wishListId: 2 }
    ],
    message: 'Wishlist retrieved successfully'
  };

  const mockBookResponse: ResponseStructure<BookResponse> = {
    status: 200,
    data: {
      bookId: 1,
      bookName: 'Test Book',
      bookAuthor: 'Test Author',
      bookDescription: 'Descript',
      bookPrice: 200,
      bookLogo: 'Url2',
      bookQuantity: 50
    },
    message: 'Book retrieved successfully'
  };

  beforeEach(async () => {
    mockWishlistService = {
      getWishList: jest.fn(),
      addToWishList: jest.fn(),
      onWishListChanged: {
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

    mockCartService = {
      addBookToCart: jest.fn(),
      onCartCalled: {
        next: jest.fn()
      }
    } as any;

    mockSnackBar = {
      open: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [WishListComponent],
      providers: [
        { provide: WishlistService, useValue: mockWishlistService },
        { provide: BooksService, useValue: mockBooksService },
        { provide: CartService, useValue: mockCartService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListComponent);
    component = fixture.componentInstance;
  });


  describe('getWishListBooks', () => {
    it('should retrieve wishlist books successfully', () => {
      mockWishlistService.getWishList.mockReturnValue(of(mockWishListResponse));
      mockBooksService.getBookById.mockReturnValue(of(mockBookResponse));
      component.getWishListBooks();
      if (mockWishListResponse.data)
        expect(component.wishListBooks).toEqual(mockWishListResponse.data);
      expect(mockBooksService.getBookById).toHaveBeenCalledTimes(2);
    });

    it('should handle empty wishlist', () => {
      const emptyResponse: ResponseStructure<WishListResponse[]> = {
        status: 200,
        data: [],
        message: 'No books in wishlist'
      };
      mockWishlistService.getWishList.mockReturnValue(of(emptyResponse));
      component.getWishListBooks();
      expect(component.wishListBooks).toEqual([]);
      expect(component.booksInWishList).toEqual([]);
    });
  });


  describe('addToWishList', () => {
    it('should add book to wishlist successfully', () => {
      const addResponse: ResponseStructure<WishListResponse> = {
        status: 201,
        data: { bookId: 3, wishListId: 3 },
        message: 'Book added to wishlist'
      };
      mockWishlistService.addToWishList.mockReturnValue(of(addResponse));
      component.addToWishList(3);
      expect(mockSnackBar.open).toHaveBeenCalledWith(addResponse.message, '', { duration: 3000 });
      expect(mockWishlistService.onWishListChanged.next).toHaveBeenCalledWith(true);
    });

    it('should handle wishlist add error', () => {
      const errorResponse: ResponseStructure<WishListResponse> = {
        status: 400,
        message: 'Bad request',
        data: null
      };
      mockWishlistService.addToWishList.mockReturnValue(throwError(() => errorResponse));
      component.addToWishList(3);
      expect(mockSnackBar.open).toHaveBeenCalledWith(errorResponse.message, '', { duration: 3000 });
    });
  });


  describe('onAddToCart', () => {
    it('should add book to cart successfully', () => {
      const cartResponse: ResponseStructure<CartResponse> = {
        status: 200,
        data: { bookId: 1, cartId: 1, cartQuantity: 1 },
        message: 'Book added to cart'
      };
      mockCartService.addBookToCart.mockReturnValue(of(cartResponse));
      component.onAddToCart(1);
      expect(mockSnackBar.open).toHaveBeenCalledWith(cartResponse.message, '', { duration: 3000 });
      expect(mockBooksService.onBookChanged.next).toHaveBeenCalledWith(true);
      expect(mockCartService.onCartCalled.next).toHaveBeenCalledWith(true);
    });

    it('should handle cart add error', () => {
      const errorResponse: ResponseStructure<CartResponse> = {
        status: 400,
        message: 'Bad request',
        data: null
      };
      mockCartService.addBookToCart.mockReturnValue(throwError(() => errorResponse));
      component.onAddToCart(1);
      expect(mockSnackBar.open).toHaveBeenCalledWith(errorResponse.message, '', { duration: 3000 }
      );
    });
  });


  describe('isBookPresent', () => {
    it('should return true if book is in wishlist', () => {
      component.wishListBooks = [
        {
          bookId: 1,
          wishListId: 1
        },
        {
          bookId: 2,
          wishListId: 2
        }
      ];
      expect(component.isBookPresent(1)).toBeTruthy();
      expect(component.isBookPresent(2)).toBeTruthy();
      expect(component.isBookPresent(3)).toBeFalsy();
    });
  });
});
