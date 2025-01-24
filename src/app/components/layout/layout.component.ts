import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoggedInUser } from '../../model/classes/user';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
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

  router: Router = inject(Router);

  isPopUpOpen: boolean = true;

  readonly dialog = inject(MatDialog);

  getCurrentUser():void {
    const user = localStorage.getItem("UserDetails");
    if (user != null) {
      debugger;
      const pardedUser = JSON.parse(user);
      this.currentUser = pardedUser;
    }
  };

  ngOnInit(): void {
    this.getCurrentUser();
  }

  onLogOut(): void {
    const msg = confirm("Do you want to Logout?");
    if (msg) {
      this.snackbar.open('Logout Success', '', { duration: 3000 });
      localStorage.removeItem("appToken");
      localStorage.removeItem("UserDetails");
      this.router.navigateByUrl("/login");
    }
  };

  showCartPopUp():void {
    this.isPopUpOpen = !this.isPopUpOpen
  };

  openAddBook():void {
    this.dialog.open(AddBookComponent, {
      panelClass: 'right-dialog-container',
      width: '400px',
      height: '500px'
    });
  };

  openDialog():void {
    this.dialog.open(CartComponent, {
      panelClass: 'right-dialog-container',
      width: '600px',
      position: {
        right: '30px',
        top: '60px',
      }
    });
  };
}
