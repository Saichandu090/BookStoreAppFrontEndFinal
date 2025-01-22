import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Address } from '../../model/classes/cart';
import { AddressService } from '../../services/address/address.service';
import { AddressResponse, ResponseStructure } from '../../model/interfaces/jsonresponse';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent {

  private addressService: AddressService = inject(AddressService);

  private snackbar: MatSnackBar = inject(MatSnackBar);

  private fb: FormBuilder = inject(FormBuilder);

  newAddress: FormGroup = this.fb.group({
    streetName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    pinCode: new FormControl('', [Validators.required])
  })

  addNewAddress():void {
    this.addressService.addAddress(this.newAddress.value).subscribe({
      next: (res: ResponseStructure<AddressResponse>) => {
        if (res.status === 201 && res.data) {
          this.snackbar.open("Address added successfully", '', { duration: 3000 });
          this.addressService.onAddressChange.next(true);
        }
      },
      error: (error: ResponseStructure<AddressResponse>) => {
        this.snackbar.open(error.message, '', { duration: 3000 });
      }
    });
  };
}