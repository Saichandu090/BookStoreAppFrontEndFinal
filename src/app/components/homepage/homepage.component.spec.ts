import { WishlistService } from './../../services/wishList/wishlist.service';
import { CartService } from './../../services/cart/cart.service';
import { BooksService } from './../../services/books/books.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { BookResponse, ResponseStructure, WishListResponse } from '../../model/interfaces/jsonresponse';
import { CartResponse } from '../../model/interfaces/cart';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let mockBooksService: jest.Mocked<BooksService>;
  let mockCartService: jest.Mocked<CartService>;
  let mockWishlistService: jest.Mocked<WishlistService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    mockBooksService = {
      getAllBooks: jest.fn(),
      getBookById: jest.fn(),
      deleteBook: jest.fn(),
      updateBook: jest.fn(),
      onBookChanged: {
        next: jest.fn(),
        subscribe: jest.fn()
      }
    } as any;

    mockCartService = {
      addBookToCart: jest.fn(),
      onCartCalled: {
        next: jest.fn()
      }
    } as any;

    mockWishlistService = {
      addToWishList: jest.fn(),
      getWishList: jest.fn(),
      onWishListChanged: {
        next: jest.fn(),
        subscribe: jest.fn()
      }
    } as any;

    mockSnackBar = {
      open: jest.fn()
    } as any;

    const localStorageMock = (() => {
      let store: { [key: string]: string } = {};
      return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        clear: () => {
          store = {};
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    TestBed.configureTestingModule({
      imports: [HomepageComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: BooksService, useValue: mockBooksService },
        { provide: CartService, useValue: mockCartService },
        { provide: WishlistService, useValue: mockWishlistService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;

    localStorage.setItem('UserDetails', JSON.stringify({
      email: 'test@example.com',
      role: 'USER'
    }));
  });


  const mockBookResponse: ResponseStructure<BookResponse[]> = {
    status: 200,
    message: 'Books fetched',
    data: [
      {
        bookId: 1,
        bookName: 'Book',
        bookAuthor: 'Author',
        bookPrice: 199.99,
        bookQuantity: 200,
        bookDescription: 'Test Description',
        bookLogo: 'Url'
      }
    ]
  };

  const mockSingleBookResponse: ResponseStructure<BookResponse> = {
    status: 200,
    message: 'Book fetched',
    data: {
      bookId: 1,
      bookName: 'Book',
      bookAuthor: 'Author',
      bookPrice: 299.99,
      bookQuantity: 120,
      bookDescription: 'Test Description',
      bookLogo: 'UrL'
    }
  };

  it('should retrieve current user from localStorage', () => {
    component.getCurrentUser();
    expect(component.currentUser.email).toBe('test@example.com');
    expect(component.currentUser.role).toBe('USER');
  });


  it('should load books successfully on initialization', () => {
    mockBooksService.getAllBooks.mockReturnValue(of(mockBookResponse));
    mockWishlistService.getWishList.mockReturnValue(of({
      status: 200,
      message: '',
      data: []
    }));
    fixture.detectChanges();
    expect(mockBooksService.getAllBooks).toHaveBeenCalled();
    expect(component.bookList.length).toBe(1);
    expect(component.bookList[0].bookName).toBe('Book');
  });



  it('should handle book loading error', () => {
    const errorResponse = {
      status: 500,
      message: 'Failed to load books'
    };
    mockBooksService.getAllBooks.mockReturnValue(throwError(() => errorResponse));
    mockWishlistService.getWishList.mockReturnValue(of({
      status: 200,
      message: '',
      data: []
    }));
    fixture.detectChanges();
    expect(mockSnackBar.open).toHaveBeenCalledWith(errorResponse.message, '', { duration: 3000 });
  });



  it('should delete book when confirmed', () => {
    const successResponse: ResponseStructure<string> = {
      status: 200,
      message: 'Book deleted successfully',
      data: null
    };
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    mockBooksService.deleteBook.mockReturnValue(of(successResponse));
    component.onDeleteBook(1);
    expect(mockBooksService.deleteBook).toHaveBeenCalledWith(1);
    expect(mockSnackBar.open).toHaveBeenCalledWith(successResponse.message, '', { duration: 3000 });
    expect(mockBooksService.onBookChanged.next).toHaveBeenCalledWith(true);
  });




  it('should add book to cart successfully', () => {
    const successResponse: ResponseStructure<CartResponse> = {
      status: 200,
      message: 'Book added to cart',
      data: {
        bookId: 1,
        cartId: 1,
        cartQuantity: 1
      }
    };
    mockCartService.addBookToCart.mockReturnValue(of(successResponse));
    component.onAddToCart(1);
    expect(mockCartService.addBookToCart).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith(successResponse.message, '', { duration: 3000 });
    expect(mockCartService.onCartCalled.next).toHaveBeenCalledWith(true);
  });



  it('should add book to wishlist successfully', () => {
    const successResponse: ResponseStructure<WishListResponse> = {
      status: 201,
      message: 'Book added to wishlist',
      data: {
        bookId: 1,
        wishListId: 1
      }
    };
    mockWishlistService.addToWishList.mockReturnValue(of(successResponse));
    component.addToWishList(1);
    expect(mockWishlistService.addToWishList).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith(successResponse.message, '', { duration: 3000 });
    expect(mockWishlistService.onWishListChanged.next).toHaveBeenCalledWith(true);
  });



  it('should fetch book details for editing', () => {
    component.editableBook = 1;
    mockBooksService.getBookById.mockReturnValue(of(mockSingleBookResponse));
    component.getBookById();
    expect(mockBooksService.getBookById).toHaveBeenCalledWith(1);
    expect(component.bookForm.get('bookName')?.value).toBe('Book');
  });



  it('should update book successfully', () => {
    const successResponse: ResponseStructure<BookResponse> = {
      status: 200,
      message: 'Book updated successfully',
      data: {
        bookId: 1,
        bookAuthor: 'Updated Author',
        bookPrice: 29.9,
        bookDescription: 'Old one',
        bookLogo: 'Old one',
        bookName: 'Updated Book',
        bookQuantity: 23
      }
    };
    component.editableBook = 1;
    component.bookForm.patchValue({
      bookName: 'Updated Book',
      bookAuthor: 'Updated Author',
      bookPrice: 29.99
    });
    mockBooksService.updateBook.mockReturnValue(of(successResponse));
    component.onUpdateBook();
    expect(mockBooksService.updateBook).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith(successResponse.message, '', { duration: 3000 });
    expect(mockBooksService.onBookChanged.next).toHaveBeenCalledWith(true);
  });



  it('should correctly check if book is in wishlist', () => {
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
    expect(component.isBookPresent(1)).toBe(true);
    expect(component.isBookPresent(3)).toBe(false);
  });
});
