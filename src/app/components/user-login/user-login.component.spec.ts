import { LoginService } from './../../services/login/login.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { UserLoginComponent } from './user-login.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { LoginResponse, RegisterResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let mockLoginService: jest.Mocked<LoginService>;
  let mockRouter: jest.Mocked<Router>;
  let mockToastr: jest.Mocked<ToastrService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    mockLoginService = {
      loginUser: jest.fn(),
      registerUser: jest.fn()
    } as any;

    mockRouter = {
      navigateByUrl: jest.fn()
    } as any;

    mockToastr = {
      success: jest.fn(),
      error: jest.fn()
    } as any;

    mockSnackBar = {
      open: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [UserLoginComponent, ReactiveFormsModule],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Login Form Validation', () => {
    it('should create login form with required validators', () => {
      const emailControl = component.loginForm.get('email');
      const passwordControl = component.loginForm.get('password');

      expect(emailControl?.hasValidator(Validators.required)).toBeTruthy();
      expect(emailControl?.hasValidator(Validators.email)).toBeTruthy();
      expect(passwordControl?.hasValidator(Validators.required)).toBeTruthy();
    });
  });

  describe('Register Form Validation', () => {
    it('should validate first name format', () => {
      const firstNameControl = component.registerForm.get('firstName');

      firstNameControl?.setValue('John');
      expect(firstNameControl?.valid).toBeTruthy();

      firstNameControl?.setValue('john');
      expect(firstNameControl?.valid).toBeFalsy();

      firstNameControl?.setValue('J');
      expect(firstNameControl?.valid).toBeFalsy();
    });

    it('should validate password format', () => {
      const passwordControl = component.registerForm.get('password');

      passwordControl?.setValue('validPass123');
      expect(passwordControl?.valid).toBeTruthy();

      passwordControl?.setValue('short');
      expect(passwordControl?.valid).toBeFalsy();
    });
  });

  describe('handleLogin', () => {
    it('should login successfully', () => {
      const loginResponse: ResponseStructure<LoginResponse> = {
        status: 200,
        data: {
          email: 'test@example.com',
          role: 'USER'
        },
        message: 'token123'
      };
      mockLoginService.loginUser.mockReturnValue(of(loginResponse));
      component.loginForm.setValue({email: 'test@example.com', password: 'password123'});
      component.handleLogin();
      expect(mockLoginService.loginUser).toHaveBeenCalledWith(component.loginForm.value);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Welcome to BookStore, Login Success!!', '', { duration: 3000 });
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/homepage');
      expect(localStorage.getItem('appToken')).toBeTruthy();
    });

    it('should handle login error', () => {
      const errorResponse = {
        message: 'Login failed'
      };

      mockLoginService.loginUser.mockReturnValue(throwError(() => errorResponse));
      component.handleLogin();
      expect(mockToastr.error).toHaveBeenCalledWith('Login failed');
    });
  });

  describe('handleSignup', () => {
    it('should register user successfully', () => {
      const registerResponse:ResponseStructure<RegisterResponse> = {
        status: 201,
        message: 'User registered successfully',
        data:{
          email:'neha@example.com',
          role:'USER',
          userId:1
        }
      };
      component.registerForm.setValue({
        firstName: 'Kakkar',
        lastName: 'Neha',
        email: 'neha@example.com',
        password: 'validPass123',
        dob: new Date('2003-01-01')
      });

      mockLoginService.registerUser.mockReturnValue(of(registerResponse));
      component.handleSignup();
      expect(mockLoginService.registerUser).toHaveBeenCalled();
      expect(mockToastr.success).toHaveBeenCalledWith('User registered successfully');
      expect(component.isLogin).toBeFalsy();
    });

    it('should handle invalid registration form', () => {
      component.registerForm.setValue({
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: 'short',
        dob: ''
      });
      component.handleSignup();
      expect(mockToastr.error).toHaveBeenCalledWith('Form Invalid');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2023-05-15');
      const formattedDate = component.formatDate(testDate);
      expect(formattedDate).toBe('2023-05-15');
    });
  });

  describe('toggleForm', () => {
    it('should toggle between login and register forms', () => {
      const initialState = component.isLogin;
      component.toggleForm();
      expect(component.isLogin).not.toBe(initialState);
      expect(component.loginForm.pristine).toBeTruthy();
      expect(component.registerForm.pristine).toBeTruthy();
    });
  });
});
