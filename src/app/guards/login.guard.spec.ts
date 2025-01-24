import { APP_CONSTANTS } from './../constants/constant';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { loginGuard } from './login.guard';

describe('loginGuard', () => {
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    mockRouter = {
      navigateByUrl: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow access when login token exists', () => {
    localStorage.setItem(APP_CONSTANTS.LOGIN_TOKEN, 'test-token');
    const result = TestBed.runInInjectionContext(() =>
      loginGuard({} as any, {} as any)
    );
    expect(result).toBeTruthy();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect to login when no token exists', () => {
    const result = TestBed.runInInjectionContext(() =>
      loginGuard({} as any, {} as any)
    );
    expect(result).toBeFalsy();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
