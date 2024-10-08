import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { FormServicesService } from 'src/app/services/form-services.service';
import { EcommerceValidators } from 'src/app/validators/ecommerce-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private formServicesservice: FormServicesService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl<string>('', [
          Validators.required,
          Validators.minLength(2),
          EcommerceValidators.notOnlyWhitespace,
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          EcommerceValidators.notOnlyWhitespace,
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
          EcommerceValidators.notOnlyWhitespace,
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl<string>('', [Validators.required]),
        street: new FormControl<string>('', [
          Validators.required,
          Validators.minLength(2),
          EcommerceValidators.notOnlyWhitespace,
        ]),
        city: new FormControl<string>('', [Validators.required]),
        state: new FormControl<string>('', [
          Validators.required,
          Validators.minLength(2),
          EcommerceValidators.notOnlyWhitespace,
        ]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          EcommerceValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl<string>('', [Validators.required]),
        street: new FormControl<string>('', [
          Validators.required,
          Validators.minLength(2),
          EcommerceValidators.notOnlyWhitespace,
        ]),
        city: new FormControl<string>('', [Validators.required]),
        state: new FormControl<string>('', [
          Validators.required,
          Validators.minLength(2),
          EcommerceValidators.notOnlyWhitespace,
        ]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          EcommerceValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl<string>('', [Validators.required]),
        nameOnCard: new FormControl<string>('', [
          Validators.required,
          Validators.minLength(2),
          EcommerceValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl<string>('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl<string>('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth:', startMonth);

    this.formServicesservice
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      });

    this.formServicesservice.getCreditCardYears().subscribe((data) => {
      console.log('Retrieved credit card years: ' + JSON.stringify(data));
      this.creditCardYears = data;
    });

    this.formServicesservice.getCountries().subscribe((data) => {
      console.log('Retrieved countries: ' + JSON.stringify(data));
      this.countries = data;
    });
  }

  reviewCartDetails() {
    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event: Event) {
    const ischecked = (<HTMLInputElement>event.target).checked;
    if (ischecked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log('Handling the submit button: ');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(
      'The email address is: ',
      this.checkoutFormGroup.get('customer')?.value.email
    );
    console.log(
      'The shipping address country is:' +
        this.checkoutFormGroup.get('shippingAddress')?.value.country.name
    );
    console.log(
      'The shipping address state is:' +
        this.checkoutFormGroup.get('shippingAddress')?.value.state.name
    );
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = creditCardFormGroup?.value.expirationYear;

    // if the current year equals the selected year, then start with current month.

    let startMonth: number;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.formServicesservice
      .getCreditCardMonths(startMonth)
      .subscribe((data) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
        if (selectedYear === currentYear) {
          let selectedMonth =
            creditCardFormGroup?.get('expirationMonth')?.value;
          if (selectedMonth < startMonth) {
            selectedMonth.setValue(startMonth);
          }
        }
      });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    console.log(`fromGroup: ${JSON.stringify(formGroup?.value)}`);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.formServicesservice.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      // select first state as default
      formGroup?.get('state')?.setValue(data[0]);
    });
  }
}
