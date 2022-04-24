export class CheckoutForm {

  private full_name: string;
  private phone_number: string;
  private country: string;
  private state: string;
  private city: string;
  private contact_address: string;
  private zip: string;
  private payment_method: string;
  private delivery_method: string;

  constructor(data?: any) {
    if (data) {
      this.full_name = data.full_name ? data.full_name : undefined;
      this.phone_number = data.phone_number ? data.phone_number : undefined;
      this.country = data.country ? data.country : undefined;
      this.state = data.state ? data.state : undefined;
      this.city = data.city ? data.city : undefined;
      this.contact_address = data.contact_address ? data.contact_address : undefined;
      this.zip = data.zip ? data.zip : undefined;
      this.payment_method = data.payment_method ? data.payment_method : undefined;
      this.delivery_method = data.delivery_method ? data.delivery_method : undefined;
      this.country = data.country ? data.country : undefined;
    }
  }

  public getFullName(): string {
    return this.full_name;
  }

  public setFullName(full_name: string): void {
    this.full_name = full_name;
  }

  public getPhoneNumber(): string {
    return this.phone_number;
  }

  public setPhoneNumber(phone_number: string): void {
    this.phone_number = phone_number;
  }

  public getCountry(): string {
    return this.country;
  }

  public setCountry(country: string): void {
    this.country = country;
  }

  public getState(): string {
    return this.state;
  }

  public setState(state: string): void {
    this.state = state;
  }

  public getCity(): string {
    return this.city;
  }

  public setCity(city: string): void {
    this.city = city;
  }

  public getContactAddress(): string {
    return this.contact_address;
  }

  public setContactAddress(contact_address: string): void {
    this.contact_address = contact_address;
  }

  public getZip(): string {
    return this.zip;
  }

  public setZip(zip: string): void {
    this.zip = zip;
  }

  public getPaymentMethod(): string {
    return this.payment_method;
  }

  public setPaymentMethod(payment_method: string): void {
    this.payment_method = payment_method;
  }

  public getDeliveryMethod(): string {
    return this.delivery_method;
  }

  public setDeliveryMethod(delivery_method: string): void {
    this.delivery_method = delivery_method;
  }

}