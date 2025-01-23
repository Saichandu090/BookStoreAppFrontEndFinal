import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { LoggedInUser } from '../../model/classes/user';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  const mockSnackBar = {
    open: jest.fn()
  };

  const mockRouter = {
    navigateByUrl: jest.fn()
  };

  const mockDialog = {
    open: jest.fn()
  };

  const mockFormBuilder = {
    group: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent,RouterTestingModule],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
        { provide: FormBuilder, useValue: mockFormBuilder }
      ]
    }).compileComponents();

    localStorage.clear();
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
  });

  // Test getCurrentUser method
  describe('getCurrentUser', () => {
    it('should retrieve user details from localStorage', () => {
      const mockUser = {
        email: 'test@example.com',
        role: 'user'
      };
      localStorage.setItem('UserDetails', JSON.stringify(mockUser));
      component.getCurrentUser();
      expect(component.currentUser.email).toBe('test@example.com');
      expect(component.currentUser.role).toBe('user');
    });

    it('should do nothing if no user details in localStorage', () => {
      component.getCurrentUser();
      expect(component.currentUser).toEqual(new LoggedInUser());
    });
  });


  describe('onLogOut', () => {
    it('should logout successfully when confirmed', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      component.onLogOut();
      expect(localStorage.getItem('appToken')).toBeNull();
      expect(localStorage.getItem('UserDetails')).toBeNull();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
      expect(mockSnackBar.open).toHaveBeenCalledWith('Logout Success', '', { duration: 3000 });
    });

    it('should not logout when not confirmed', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);
      component.onLogOut();
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
      expect(mockSnackBar.open).not.toHaveBeenCalled();
    });
  });


  describe('showCartPopUp', () => {
    it('should toggle isPopUpOpen', () => {

      component.isPopUpOpen = true;
      component.showCartPopUp();
      expect(component.isPopUpOpen).toBe(false);
      component.showCartPopUp();
      expect(component.isPopUpOpen).toBe(true);
    });
  });


  describe('bookForm Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate book name', () => {
      const bookNameControl = component.bookForm.get('bookName');
      bookNameControl?.setValue('Valid Book Name');
      expect(bookNameControl?.valid).toBeTruthy();

      bookNameControl?.setValue('ab');
      expect(bookNameControl?.valid).toBeFalsy();

      bookNameControl?.setValue('Book123');
      expect(bookNameControl?.valid).toBeFalsy();
    });

    it('should validate book author', () => {
      const bookAuthorControl = component.bookForm.get('bookAuthor');

      bookAuthorControl?.setValue('John Doe');
      expect(bookAuthorControl?.valid).toBeTruthy();

      bookAuthorControl?.setValue('Jo');
      expect(bookAuthorControl?.valid).toBeFalsy();

      bookAuthorControl?.setValue('Author123');
      expect(bookAuthorControl?.valid).toBeFalsy();
    });

    it('should validate book price', () => {
      const bookPriceControl = component.bookForm.get('bookPrice');

      bookPriceControl?.setValue('10.50');
      expect(bookPriceControl?.valid).toBeTruthy();

      bookPriceControl?.setValue('price');
      expect(bookPriceControl?.valid).toBeFalsy();

      bookPriceControl?.setValue('-10');
      expect(bookPriceControl?.valid).toBeFalsy();
    });
  });
});
