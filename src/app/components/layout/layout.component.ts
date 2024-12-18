import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IJsonResponse } from '../../model/interfaces/jsonresponse';
import { Book } from '../../model/classes/book';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoggedInUser } from '../../model/classes/user';
import { ToastrService } from 'ngx-toastr';
import { BooksService } from '../../services/books/books.service';
import { LoginService } from '../../services/login/login.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ICart } from '../../model/interfaces/cart';
import { CartService } from '../../services/cart/cart.service';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';
import { UserEditComponent } from '../user-edit/user-edit.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, FormsModule, RouterOutlet, ReactiveFormsModule, ButtonModule, ConfirmPopupModule, CommonModule,MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  @ViewChild("addBook") addBook: ElementRef | undefined;

  private loginService = inject(LoginService);

  private bookService = inject(BooksService);

  //=========================================//

  constructor(private toastr: ToastrService) {
  }

  currentUser: LoggedInUser = new LoggedInUser();

  getCurrentUser() {
    const user = localStorage.getItem("UserDetails");
    if (user != null) {
      debugger;
      const pardedUser = JSON.parse(user);
      this.currentUser = pardedUser[0];
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

  //=====================================//

  isPopUpOpen: boolean = true;

  showCartPopUp() {
    this.isPopUpOpen = !this.isPopUpOpen
  }

  //====================================//

  openAddBook() {
    if (this.addBook) {
      this.addBook.nativeElement.style.display = "block"
    }
  }

  closeAddBookModel() {
    if (this.addBook) {
      this.bookForm.reset()
      this.addBook.nativeElement.style.display = "none"
    }
  }

  book: Book = new Book();

  fb: FormBuilder = inject(FormBuilder);

  bookForm = this.fb.group({
    name: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]{3,}$")]),
    author: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]{5,}$")]),
    description: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z ]{5,}$")]),
    price: new FormControl('', [Validators.required, Validators.pattern("^[0-9.]+$")]),
    quantity: new FormControl('', [Validators.required, Validators.min(16)]),
    bookLogo: new FormControl('', [Validators.required])
  })

  addNewBook() {

    if(this.bookForm.invalid){
      this.toastr.error("Please fill the form to submit")
    }else{
      this.book = Object.assign(new Book(), this.bookForm.value);
      console.log(this.book)
      this.bookService.addNewBook(this.book).subscribe((res: IJsonResponse) => {
        if (res.result) {
          console.log(res.message)
          this.toastr.success("Book added Successfully")
          this.bookService.onBookChanged.next(true);
          this.closeAddBookModel();
        }
      })
    } 
  }

  subscriptionList: Subscription[] = [];


  //=============================================//

  showSuccess() {
    this.toastr.show('Logout Success');
  }

  //=============================================//
  readonly dialog = inject(MatDialog);

  openDialog() {
    this.dialog.open(CartComponent,{
      panelClass: 'right-dialog-container',
      width: '600px',
      position: { 
        right: '30px', /* Align to the right */
        top: '60px',    /* Optional: Align to the top */
      }
  });
  }

  openDialogForEdit(){
    this.dialog.open(UserEditComponent,{
      panelClass: 'right-dialog-container',
      width: '400px',
      //height: '500px'
    })
  }
}
