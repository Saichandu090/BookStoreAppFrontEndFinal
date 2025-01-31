import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Book } from '../../model/classes/book';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BooksService } from '../../services/books/books.service';
import { BookResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent implements OnInit {

  book: Book = new Book();

  snackBar: MatSnackBar = inject(MatSnackBar);

  bookService: BooksService = inject(BooksService);

  formBuilder: FormBuilder = inject(FormBuilder);

  bookForm = this.formBuilder.group({
    bookId: new FormControl(0, [Validators.required]),
    bookName: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z .,\'-_=+]{2,}$')]),
    bookAuthor: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z .,\'-_=+]{2,}$')]),
    bookDescription: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-zA-Z0-9 .,\'-_=+]{2,}$')]),
    bookPrice: new FormControl(0, [Validators.required, Validators.pattern("^[0-9.]+$")]),
    bookQuantity: new FormControl(0, [Validators.required, Validators.min(16)]),
    bookLogo: new FormControl('', [Validators.required,Validators.maxLength(255)])
  });

  addNewBook(): void {
    if (this.bookForm.invalid) {
      this.snackBar.open("Please fill the form to submit ", '', { duration: 3000 });
      return;
    } else {
      this.book = Object.assign(new Book(), this.bookForm.value);
      this.bookService.addNewBook(this.book).subscribe({
        next: (response: ResponseStructure<BookResponse>) => {
          if (response.status === 201) {
            this.snackBar.open("Book added Successfully", '', { duration: 3000 })
            this.bookService.onBookChanged.next(true);
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error?.message || error.message;
          this.snackBar.open(errorMessage, '', { duration: 3000 });
        }
      });
    }
  };

  resetForm(): void {
    this.bookForm.patchValue({
      bookId: null,
      bookName: '',
      bookAuthor: '',
      bookDescription: '',
      bookPrice: null,
      bookQuantity: null,
      bookLogo: ''
    });
  }

  ngOnInit(): void {
    this.resetForm();
  }
}
