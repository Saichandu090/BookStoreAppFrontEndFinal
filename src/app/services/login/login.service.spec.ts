import { ILogin } from './../../model/interfaces/user';
import { UserRegister, UserEdit } from './../../model/classes/user';
import { LoginResponse, RegisterResponse, ResponseStructure } from './../../model/interfaces/jsonresponse';
import { LoginService } from './login.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  const mockRegisterResponse: ResponseStructure<RegisterResponse> = {
    status: 201,
    message: 'User registered successfully',
    data: {
      email:'testuser@example.com',
      role:"ADMIN",
      userId:1
    }
  };

  const mockLoginResponse: ResponseStructure<LoginResponse> = {
    status: 200,
    message: 'JWT-Token',
    data: {
      email:'testuser@example.com',
      role:'ADMIN'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService,provideHttpClientTesting()]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const user: UserRegister = {
      // Provide user object data based on the actual UserRegister model
      firstName: 'Test',
      lastName: 'Angular',
      email: 'testuser@example.com',
      dob: '2002-8-24',
      password: 'testing@090',
      role: 'ADMIN'
    };

    service.registerUser(user).subscribe(response => {
      expect(response.status).toBe(201);
      expect(response.message).toBe('User registered successfully');
    });

    const req = httpMock.expectOne('http://localhost:8080/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockRegisterResponse);
  });


  
  it('should login a user', () => {
    const user: ILogin = {
      // Provide login object data based on the actual ILogin model
      email: 'testuser@example.com',
      password: 'testing@090',
    };

    service.loginUser(user).subscribe(response => {
      expect(response.status).toBe(200);
      expect(response.message).toBe('JWT-Token');
    });

    const req = httpMock.expectOne('http://localhost:8080/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);
  });
});
