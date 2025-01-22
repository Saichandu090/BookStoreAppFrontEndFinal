import { ILogin } from './../../model/interfaces/user';
import { UserRegister, UserEdit } from './../../model/classes/user';
import { LoginResponse, RegisterResponse, ResponseStructure } from './../../model/interfaces/jsonresponse';
import { LoginService } from './login.service';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService, provideHttpClientTesting()]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const user: UserRegister = {
      firstName: 'Test',
      lastName: 'Angular',
      email: 'testuser@example.com',
      dob: '2002-8-24',
      password: 'testing@090',
      role: 'ADMIN'
    };

    const mockRegisterResponse: ResponseStructure<RegisterResponse> = {
      status: 201,
      message: 'User registered successfully',
      data: {
        email: 'testuser@example.com',
        role: "ADMIN",
        userId: 1
      }
    };

    service.registerUser(user).subscribe({
      next: (response: ResponseStructure<RegisterResponse>) => {
        expect(response.status).toBe(201);
        expect(response.message).toBe('User registered successfully');
      },
      error: (error) => {
        fail('expected response in registerUser');
      }
    }
    );

    const req = httpMock.expectOne('http://localhost:8080/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockRegisterResponse);
  });


  it('should handle registration error', () => {
    const user: UserRegister = {
      firstName: 'Test',
      lastName: 'Angular',
      email: 'testuser@example.com',
      dob: '2002-8-24',
      password: 'testing@090',
      role: 'ADMIN'
    };

    const mockErrorResponse = {
      status: 500,
      message: 'Internal Server Error',
      data: null
    };

    service.registerUser(user).subscribe({
      next: (response: ResponseStructure<RegisterResponse>) => {
        fail('expected error in registerUser');
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.message).toBe('Internal Server Error');
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockErrorResponse);
  });



  it('should login a user', () => {
    const user: ILogin = {
      email: 'testuser@example.com',
      password: 'testing@090',
    };

    const mockLoginResponse: ResponseStructure<LoginResponse> = {
      status: 200,
      message: 'JWT-Token',
      data: {
        email: 'testuser@example.com',
        role: 'ADMIN'
      }
    };

    service.loginUser(user).subscribe({
      next:(response:ResponseStructure<LoginResponse>) => {
        expect(response.status).toBe(200);
        expect(response.message).toBe('JWT-Token');
      },
      error:(error)=>{
        fail('expected response in loginUser');
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);
  });


  it('should handle login error', () => {
    const user: ILogin = {
      email: 'testuser@example.com',
      password: 'wrongPassword',
    };

    const mockErrorResponse = {
      status: 401,
      message: 'Invalid credentials',
      data: null
    };

    service.loginUser(user).subscribe({
      next:(response) => {
        fail('expected error in loginUser');
      },
      error:(error) => {
        expect(error.status).toBe(401);
        expect(error.message).toBe('Invalid credentials');
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockErrorResponse);
  });
});
