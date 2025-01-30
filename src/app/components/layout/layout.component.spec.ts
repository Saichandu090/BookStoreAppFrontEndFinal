import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoggedInUser } from '../../model/classes/user';
import { RouterTestingModule } from '@angular/router/testing';
import { UserLoginComponent } from '../user-login/user-login.component';
import { ToastrService } from 'ngx-toastr';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;
  let mockDialog: jest.Mocked<MatDialog>;
  let mockToaster: jest.Mocked<ToastrService>;

  beforeEach(async () => {
    mockRouter = {
      navigateByUrl: jest.fn().mockResolvedValue(true),
      config: []
    } as any;

    mockSnackBar = {
      open: jest.fn()
    } as any;

    mockToaster = {
      success: jest.fn(),
      error: jest.fn()
    } as any;

    mockDialog = {
      open: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [LayoutComponent, HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: 'login', component: UserLoginComponent }])],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ToastrService, useValue: mockToaster }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getCurrentUser', () => {
    it('should parse user from localStorage', () => {
      const mockUser: LoggedInUser = { email: 'test@gamil.com', role: 'USER' };
      localStorage.setItem('UserDetails', JSON.stringify(mockUser));
      component.getCurrentUser();
      expect(component.currentUser).toEqual(mockUser);
    });

    it('should do nothing if no user in localStorage', () => {
      component.getCurrentUser();
      expect(component.currentUser).toEqual(new LoggedInUser());
    });
  });

  describe('onLogOut', () => {

    it('should logout when confirmed', fakeAsync(() => {

      localStorage.setItem('UserDetails', JSON.stringify({ email: 'something@gmail.com', role: 'ADMIN' }));
      localStorage.setItem('appToken', 'test-token');
      mockRouter.navigateByUrl.mockResolvedValue(true);
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      component.onLogOut();
      flush();

      expect(window.confirm).toHaveBeenCalledWith('Do you want to Logout?');
      expect(mockSnackBar.open).toHaveBeenCalledWith('Logout Success', '', { duration: 3000 });
      expect(localStorage.getItem('appToken')).toBeNull();
      expect(localStorage.getItem('UserDetails')).toBeNull();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
    }));

    it('should not logout when not confirmed', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);
      localStorage.setItem('UserDetails', '{"test@gmail.com": "USER"}');
      localStorage.setItem('appToken', 'test-token');
      component.onLogOut();
      expect(window.confirm).toHaveBeenCalledWith('Do you want to Logout?');
      expect(mockSnackBar.open).not.toHaveBeenCalled();
      expect(localStorage.getItem('appToken')).not.toBeNull();
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('Dialog Methods', () => {
    it('should toggle cart popup', () => {
      component.isPopUpOpen = false;
      component.showCartPopUp();
      expect(component.isPopUpOpen).toBeTruthy();
    });

    it('should open cart dialog', () => {
      component.openDialog();
      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should call getCurrentUser on initialization', () => {
      const spyGetCurrentUser = jest.spyOn(component, 'getCurrentUser');
      component.ngOnInit();
      expect(spyGetCurrentUser).toHaveBeenCalled();
    });
  });
});
