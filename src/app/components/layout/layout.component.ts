import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BookResponse, IJsonResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { Book } from '../../model/classes/book';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoggedInUser } from '../../model/classes/user';
import { BooksService } from '../../services/books/books.service';
import { LoginService } from '../../services/login/login.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddBookComponent } from '../add-book/add-book.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, FormsModule, RouterOutlet, ReactiveFormsModule, ButtonModule, ConfirmPopupModule, CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  snackbar: MatSnackBar = inject(MatSnackBar);

  currentUser: LoggedInUser = new LoggedInUser();

  getCurrentUser() {
    const user = localStorage.getItem("UserDetails");
    if (user != null) {
      debugger;
      const pardedUser = JSON.parse(user);
      this.currentUser = pardedUser;
      console.log(this.currentUser.email)
      console.log(this.currentUser.role)
    }
  }


  ngOnInit(): void {
    this.getCurrentUser();
  }


  router: Router = inject(Router);


  onLogOut() {
    const msg = confirm("Do you want to Logout?");
    if (msg) {
      this.showSuccess()
      localStorage.removeItem("appToken")
      localStorage.removeItem("UserDetails")
      this.router.navigateByUrl("/login")
    }
  }



  isPopUpOpen: boolean = true;

  showCartPopUp() {
    this.isPopUpOpen = !this.isPopUpOpen
  }



  openAddBook() {
    this.dialog.open(AddBookComponent, {
      panelClass: 'right-dialog-container',
      width: '400px',
      height:'500px'
    })
  }

  book: Book = new Book();

  fb: FormBuilder = inject(FormBuilder);

  bookForm = this.fb.group({
    bookId: new FormControl('', [Validators.required]),
    bookName: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]{3,}$")]),
    bookAuthor: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]{5,}$")]),
    bookDescription: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]{5,}$")]),
    bookPrice: new FormControl('', [Validators.required, Validators.pattern("^[0-9.]+$")]),
    bookQuantity: new FormControl('', [Validators.required, Validators.min(16)]),
    bookLogo: new FormControl('', [Validators.required])
  })


  showSuccess() {
    this.snackbar.open('Logout Success', '', { duration: 3000 });
  }


  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(CartComponent, {
      panelClass: 'right-dialog-container',
      width: '600px',
      position: {
        right: '30px',
        top: '60px',
      }
    });
  }
}
