import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginService } from './../../services/login/login.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRegisterComponent } from './admin-register.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { RegisterResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { provideNativeDateAdapter } from '@angular/material/core';
import { RouterTestingModule } from "@angular/router/testing";
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AdminRegisterComponent', () => {
  let component: AdminRegisterComponent;
  let fixture: ComponentFixture<AdminRegisterComponent>;
  let mockLoginService: jest.Mocked<LoginService>;
  let mockRouter: jest.Mocked<Router>;
  let mockToaster: jest.Mocked<ToastrService>;

  beforeEach(async () => {
    mockLoginService = {
      registerUser: jest.fn()
    } as any;

    mockRouter = {
      navigateByUrl: jest.fn()
    } as any;

    mockToaster = {
      error: jest.fn(),
      success: jest.fn()
    } as any;


    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientTestingModule,AdminRegisterComponent],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: ToastrService, useValue: mockToaster },provideNativeDateAdapter(),provideAnimations()
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(AdminRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initialize form with empty fields', () => {
      expect(component.registerForm.get('firstName')?.value).toBe('');
      expect(component.registerForm.get('lastName')?.value).toBe('');
      expect(component.registerForm.get('dob')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
      expect(component.registerForm.get('email')?.value).toBe('');
    });

    it('should validate firstName with correct pattern', () => {
      const firstNameControl = component.registerForm.get('firstName');

      firstNameControl?.setValue('John');
      expect(firstNameControl?.valid).toBeTruthy();

      firstNameControl?.setValue('john');
      expect(firstNameControl?.valid).toBeFalsy();

      firstNameControl?.setValue('J');
      expect(firstNameControl?.valid).toBeFalsy();
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');

      emailControl?.setValue('valid.email@example.com');
      expect(emailControl?.valid).toBeTruthy();

      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalsy();
    });
  });

  describe('onSubmit', () => {
    const mockValidFormData = {
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date('1990-01-01'),
      email: 'john.doe@example.com',
      password: 'Password@123'
    };

    const mockSuccessResponse: ResponseStructure<RegisterResponse> = {
      status: 201,
      message: 'Registration Successful',
      data: {
        email: 'john.doe@example.com',
        role: 'ADMIN',
        userId: 1
      }
    };

    beforeEach(() => {
      component.registerForm.setValue(mockValidFormData);
    });

    it('should register user successfully', () => {
      mockLoginService.registerUser.mockReturnValue(of(mockSuccessResponse));

      component.onSubmit();

      expect(mockToaster.success).toHaveBeenCalledWith('Registration Successful');
    });

    it('should handle registration error', () => {
      const errorResponse = {
        status: 400,
        message: 'Registration Failed',
        data: null
      };
      mockLoginService.registerUser.mockReturnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(mockToaster.error).toHaveBeenCalledWith('Registration Failed');
    });

    it('should not submit invalid form', () => {
      component.registerForm.reset();

      component.onSubmit();

      expect(mockToaster.error).toHaveBeenCalledWith('Form Invalid');
      expect(mockLoginService.registerUser).not.toHaveBeenCalled();
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2023-05-15');
      const formattedDate = component.formatDate(testDate);
      expect(formattedDate).toBe('2023-05-15');
    });

    it('should return empty string for null/undefined date', () => {
      expect(component.formatDate(null)).toBe('');
      expect(component.formatDate(undefined)).toBe('');
    });
  });
});
