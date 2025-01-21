import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent {

  book: Book = new Book();

  private snackBar: MatSnackBar = inject(MatSnackBar);

  private bookService: BooksService = inject(BooksService);

  fb: FormBuilder = inject(FormBuilder);

  bookForm = this.fb.group({
    bookId: new FormControl('', [Validators.required]),
    bookName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z .',]{3,}$")]),
    bookAuthor: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z .',]{5,}$")]),
    bookDescription: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z .',]{5,}$")]),
    bookPrice: new FormControl('', [Validators.required, Validators.pattern("^[0-9.]+$")]),
    bookQuantity: new FormControl('', [Validators.required, Validators.min(16)]),
    bookLogo: new FormControl('', [Validators.required])
  });

  addNewBook() {
    if (this.bookForm.invalid) {
      this.snackBar.open("Please fill the form to submit ", '', { duration: 3000 })
    } else {
      this.book = Object.assign(new Book(), this.bookForm.value);
      this.bookService.addNewBook(this.book).subscribe({
        next: (response: ResponseStructure<BookResponse>) => {
          if (response.status === 201) {
            this.snackBar.open("Book added Successfully", '', { duration: 3000 })
            this.bookService.onBookChanged.next(true);
          }
        },
        error: (error: ResponseStructure<BookResponse>) => {
          this.snackBar.open(error.message, '', { duration: 3000 });
        }
      })
    }
  };
}
