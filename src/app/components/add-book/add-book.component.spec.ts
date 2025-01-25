import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddBookComponent } from './add-book.component';
import { BooksService } from '../../services/books/books.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { BookResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';

describe('AddBookComponent', () => {
  let component: AddBookComponent;
  let fixture: ComponentFixture<AddBookComponent>;
  let mockBookService: jest.Mocked<BooksService>;
  let matSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    mockBookService = {
      addNewBook: jest.fn(),
      onBookChanged: {
        next: jest.fn()
      }
    } as any;

    matSnackBar = {
      open: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddBookComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        { provide: BooksService, useValue: mockBookService },
        { provide: MatSnackBar, useValue: matSnackBar }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.bookForm.get('bookId')?.value).toBe(null);
    expect(component.bookForm.get('bookName')?.value).toBe('');
    expect(component.bookForm.get('bookAuthor')?.value).toBe('');
    expect(component.bookForm.get('bookDescription')?.value).toBe('');
    expect(component.bookForm.get('bookPrice')?.value).toBe(null);
    expect(component.bookForm.get('bookQuantity')?.value).toBe(null);
    expect(component.bookForm.get('bookLogo')?.value).toBe('');
  });

  describe('addNewBook', () => {
    const mockBookData = {
      bookId: 1,
      bookName: 'Atom',
      bookAuthor: 'James',
      bookDescription: 'Habits',
      bookPrice: 199,
      bookQuantity: 345,
      bookLogo: 'URL'
    };

    const mockSuccessResponse: ResponseStructure<BookResponse> = {
      status: 201,
      message: 'Book added successfully',
      data: {
        bookId: 1,
        bookName: 'Atom',
        bookAuthor: 'James',
        bookDescription: 'Habits',
        bookPrice: 199,
        bookQuantity: 345,
        bookLogo: 'URL'
      }
    };

    const mockErrorResponse: ResponseStructure<BookResponse> = {
      status: 400,
      message: 'Bad request',
      data: null
    };

    beforeEach(() => {
      component.bookForm.setValue(mockBookData);
    });

    it('should add a book succesfully', () => {
      mockBookService.addNewBook.mockReturnValue(of(mockSuccessResponse));

      component.addNewBook();

      expect(mockBookService.addNewBook).toHaveBeenCalledWith(mockBookData);
      expect(matSnackBar.open).toHaveBeenCalledWith("Book added Successfully", '', { duration: 3000 });
      expect(mockBookService.onBookChanged.next).toHaveBeenCalledWith(true);
    });

    it('should handle error while adding a book', () => {
      mockBookService.addNewBook.mockReturnValue(throwError(() => mockErrorResponse));

      component.addNewBook();

      expect(mockBookService.addNewBook).toHaveBeenCalledWith(mockBookData);
      expect(matSnackBar.open).toHaveBeenCalledWith('Bad request', '', { duration: 3000 });
    });

    it('should not add the book with invalid form', () => {
      component.bookForm.reset();

      component.addNewBook();

      expect(mockBookService.addNewBook).not.toHaveBeenCalled();
    })
  })
});
