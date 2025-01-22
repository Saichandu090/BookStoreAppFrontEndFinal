import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAddressComponent } from './add-address.component';
import { AddressService } from '../../services/address/address.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideHttpClientTesting, HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddAddressComponent', () => {
  let component: AddAddressComponent;
  let fixture: ComponentFixture<AddAddressComponent>;
  let service:AddressService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAddressComponent,HttpClientTestingModule],
      providers:[provideHttpClientTesting(),FormBuilder,MatSnackBar,AddressService]
    })
    .compileComponents();

    service=TestBed.inject(AddressService);
    fixture = TestBed.createComponent(AddAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
