import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAddressComponent } from './add-address.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { AddressService } from '../../services/address/address.service';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('AddAddressComponent', () => {
  let component: AddAddressComponent;
  let fixture: ComponentFixture<AddAddressComponent>;
  let mockAddressService: jest.Mocked<AddressService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    mockAddressService = {
      addAddress: jest.fn(),
      onAddressChange: {
        next: jest.fn()
      }
    } as any;

    mockSnackBar = {
      open: jest.fn()
    } as any;


    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddAddressComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        { provide: AddressService, useValue: mockAddressService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.newAddress.get('streetName')?.value).toBe('');
    expect(component.newAddress.get('city')?.value).toBe('');
    expect(component.newAddress.get('state')?.value).toBe('');
    expect(component.newAddress.get('pinCode')?.value).toBe('');
  });

  describe('addNewAddress', () => {
    const mockAddressData = {
      streetName: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      pinCode: 12345
    };

    const mockSuccessResponse: ResponseStructure<AddressResponse> = {
      status: 201,
      message: 'Address added successfully',
      data: { addressId: 1, city: 'Test City', state: 'Test State', pinCode: 12345, streetName: '123 Test Street' }
    };

    const mockErrorResponse = {
      status: 400,
      message: 'Error adding address'
    };

    beforeEach(() => {
      component.newAddress.setValue(mockAddressData);
    });

    it('should add address successfully', () => {
      mockAddressService.addAddress.mockReturnValue(of(mockSuccessResponse));

      component.addNewAddress();

      expect(mockAddressService.addAddress).toHaveBeenCalledWith(mockAddressData);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Address added successfully', '', { duration: 3000 });
      expect(mockAddressService.onAddressChange.next).toHaveBeenCalledWith(true);
    });

    it('should handle error when adding address fails', () => {
      mockAddressService.addAddress.mockReturnValue(throwError(() => mockErrorResponse));

      component.addNewAddress();

      expect(mockAddressService.addAddress).toHaveBeenCalledWith(mockAddressData);
      expect(mockSnackBar.open).toHaveBeenCalledWith('Error adding address', '', { duration: 3000 });
    });

    it('should not add address with invalid form', () => {
      component.newAddress.reset();

      component.addNewAddress();

      expect(mockAddressService.addAddress).not.toHaveBeenCalled();
    });
  });
});
