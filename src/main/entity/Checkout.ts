import { VxEntity } from './abstract/VxEntity';
import { Country } from './Country';
import { PaymentMethod } from './PaymentMethod';
import { DeliveryMethod } from './DeliveryMethod';

export class Checkout extends VxEntity {

  constructor(data?: any) {
    super(data);
    if (data) {
      this.countries = data.countries ? data.countries : [];
      this.paymentMethods = data.paymentMethods ? data.paymentMethods : [];
      this.deliveryMethods = data.deliveryMethods ? data.deliveryMethods : [];
    }
  }

  private countries: Country[];
  private paymentMethods: PaymentMethod[];
  private deliveryMethods: DeliveryMethod[];

  public getCountries(): Country[] {
    return this.countries;
  }

  public setCountries(countries: Country[]): void {
    this.countries = countries;
  }

  public getPaymentMethods(): PaymentMethod[] {
    return this.paymentMethods;
  }

  public setPaymentMethods(paymentMethods: PaymentMethod[]): void {
    this.paymentMethods = paymentMethods;
  }

  public getDeliveryMethods(): DeliveryMethod[] {
    return this.deliveryMethods;
  }

  public setDeliveryMethodes(deliveryMethods: DeliveryMethod[]): void {
    this.deliveryMethods = deliveryMethods;
  }

}