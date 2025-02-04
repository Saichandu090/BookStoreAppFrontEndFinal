import { LoginService } from './../../services/login/login.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { UserLoginComponent } from './user-login.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { LoginResponse, RegisterResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { HttpErrorResponse } from '@angular/common/http';

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
      registerUser: jest.fn(),
      forgetPassword: jest.fn(),
      isUserExists: jest.fn()
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

      passwordControl?.setValue('Password@090');
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
      component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
      component.handleLogin();
      expect(mockLoginService.loginUser).toHaveBeenCalledWith(component.loginForm.value);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Welcome to BookStore, Login Success!!', '', { duration: 3000 });
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/homepage');
      expect(localStorage.getItem('appToken')).toBeTruthy();
    });

    it('should handle login error', () => {
      const errorResponse = { error: { message: 'Login failed' } };
      component.loginForm.setValue({ email: 'test@example.com', password: 'pasword123' });
      mockLoginService.loginUser.mockReturnValue(throwError(()=>errorResponse));
      component.handleLogin();
      expect(mockToastr.error).toHaveBeenCalledWith(errorResponse.error.message);
    });
  });

  describe('handleSignup', () => {
    it('should register user successfully', () => {
      const registerResponse: ResponseStructure<RegisterResponse> = {
        status: 201,
        message: 'User registered successfully',
        data: {
          email: 'neha@example.com',
          role: 'USER',
          userId: 1
        }
      };
      component.registerForm.setValue({
        firstName: 'Kakkar',
        lastName: 'Neha',
        email: 'neha@example.com',
        password: 'Password@090',
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

  describe('isUserExists', () => {
    it('should set password reset stage when user exists', () => {
      const mockEmail = 'test@example.com';
      component.forgotPasswordForm.get('email')?.setValue(mockEmail);
      mockLoginService.isUserExists.mockReturnValue(of({
        status: 200,
        data: true,
        message: ''
      }));
      component.isUserExists();
      expect(mockLoginService.isUserExists).toHaveBeenCalledWith(mockEmail);
      expect(component.isPasswordResetStage).toBeTruthy();
    });


    it('should show error when user does not exist', () => {
      const mockEmail = 'test@example.com';
      component.forgotPasswordForm.get('email')?.setValue(mockEmail);
      const mockErrorResponse: ResponseStructure<Boolean> = ({
        status: 404,
        data: false,
        message: 'User not found'
      });
      mockLoginService.isUserExists.mockReturnValue(throwError(()=>mockErrorResponse));
      component.isUserExists();
      expect(mockToastr.error).toHaveBeenCalledWith(mockErrorResponse.message);
    });
  });


  describe('handleForgotPassword', () => {
    it('should set password reset stage on first call with valid form', () => {
      component.forgotPasswordForm.get('email')?.setValue('test@example.com');
      component.forgotPasswordForm.get('newPassword')?.setValue('Password@123');
      component.forgotPasswordForm.get('confirmPassword')?.setValue('Password@123');
      component.handleForgotPassword();
      expect(component.isPasswordResetStage).toBeTruthy();
    });


    it('should reset password successfully', () => {
      component.isPasswordResetStage = true;
      component.forgotPasswordForm.get('email')?.setValue('test@example.com');
      component.forgotPasswordForm.get('newPassword')?.setValue('Password@123');
      component.forgotPasswordForm.get('confirmPassword')?.setValue('Password@123');
      const mockResponse: ResponseStructure<boolean> = ({
        status: 200,
        data: true,
        message: 'Password reset successful'
      });
      mockLoginService.forgetPassword.mockReturnValue(of(mockResponse));
      component.handleForgotPassword();
      expect(mockLoginService.forgetPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password@123'
      });
      expect(mockSnackBar.open).toHaveBeenCalledWith('Password reset successful', '', { duration: 3000 });
      expect(component.isLogin).toBeTruthy();
      expect(component.isForgotPassword).toBeFalsy();
      expect(component.isPasswordResetStage).toBeFalsy();
    });


    it('should not proceed to reset stage if form is invalid', () => {
      component.forgotPasswordForm.markAllAsTouched();
      component.forgotPasswordForm.get('email')?.setValue('');

      component.handleForgotPassword();

      expect(component.isPasswordResetStage).toBeFalsy();
    });


    it('should not submit password reset if form is invalid in reset stage', () => {
      component.isPasswordResetStage = true;
      component.forgotPasswordForm.get('newPassword')?.setValue('');
      component.handleForgotPassword();
      expect(mockLoginService.forgetPassword).not.toHaveBeenCalled();
    });


    it('should handle unsuccessful password reset response', () => {
      component.isPasswordResetStage = true;
      component.forgotPasswordForm.get('email')?.setValue('test@example.com');
      component.forgotPasswordForm.get('newPassword')?.setValue('newPassword123');
      mockLoginService.forgetPassword.mockReturnValue(
        of({ status: 400, data: false, message: 'Reset failed' })
      );
      component.handleForgotPassword();
      expect(mockSnackBar.open).not.toHaveBeenCalled();
      expect(component.isPasswordResetStage).toBeTruthy();
    });
  });
});
