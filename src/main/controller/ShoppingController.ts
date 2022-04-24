import { Request, Response, NextFunction } from 'express';
import { User } from '../entity/User';
import { UserSession } from '../entity/UserSession';
import { ShoppingCart } from '../entity/ShoppingCart';
import { PaymentMethod } from '../entity/PaymentMethod';
import { PaymentDetail } from '../entity/PaymentDetail';
import { DeliveryMethod } from '../entity/DeliveryMethod';
import { OrderItem } from '../entity/OrderItem';
import { Order } from '../entity/Order';
import { CheckoutForm } from '../entity/CheckoutForm';
import { Country } from '../entity/Country';
import { CartItemsInvalidException } from '../entity/error/CartItemsInvalidException';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { ShoppingCartHelper } from '../helper/shop/ShoppingCartHelper';
import { PaymentHelper } from '../helper/shop/PaymentHelper';
import { MailHelper } from '../helper/middleware/MailHelper';
import { MailMessage } from '../util/mail/MailMessage';
import { MailMessageImpl } from '../util/mail/MailMessageImpl';
import { MailSender } from '../util/mail/MailSender';
import { MailSenderServicesContainer } from '../util/mail/MailSenderServicesContainer';
import { CheckoutService } from '../model/service/CheckoutService';
import { CheckoutServiceImpl } from '../model/service/impl/CheckoutServiceImpl';
import { CountryService } from '../model/service/CountryService';
import { CountryServiceImpl } from '../model/service/impl/CountryServiceImpl';
import { PaymentMethodService } from '../model/service/PaymentMethodService';
import { PaymentMethodServiceImpl } from '../model/service/impl/PaymentMethodServiceImpl';
import { DeliveryMethodService } from '../model/service/DeliveryMethodService';
import { DeliveryMethodServiceImpl } from '../model/service/impl/DeliveryMethodServiceImpl';
import { OrderService } from '../model/service/OrderService';
import { OrderServiceImpl } from '../model/service/impl/OrderServiceImpl';

export class ShoppingController {

  private service: CheckoutService = new CheckoutServiceImpl();
  private countryService: CountryService = new CountryServiceImpl();
  private paymentMethodService: PaymentMethodService = new PaymentMethodServiceImpl();
  private deliveryMethodService: DeliveryMethodService = new DeliveryMethodServiceImpl();
  private orderService: OrderService = new OrderServiceImpl();
  private paymentService: PaymentHelper = new PaymentHelper();
  private config: RouteOptionsConfig | null = null;
  private mailSender: MailSender | null = MailSenderServicesContainer.getService('sendgrid');

  public init(config: RouteOptionsConfig): void { this.config = config; }

  public static setOrderItem(req: Request, res: Response, next: NextFunction): void {
    if (Object.keys(req.body).length > 0) {
      let orderItem: OrderItem = new OrderItem(+req.body.item_id, req.body.title, req.body.unit_price, 1);
      orderItem.setQuantity(+(req.body.quantity));
      orderItem.setUnitPrice(req.body.unit_price);
      req.bindingModel = orderItem;
    }
    else { req.bindingModel = null; }

    return next();
  }

  public static setShoppingCart(req: Request, res: Response, next: NextFunction): void { return next(); }

  public static setUser(req: Request, res: Response, next: NextFunction): void {
    if (req.body !== null && req.body !== undefined) {
      req.bindingModel = new User(req.body);
    }
    return next();
  }

  public static setCheckoutForm(req: Request, res: Response, next: NextFunction): void {
    if (req.body !== null && req.body !== undefined) {
      req.bindingModel = new CheckoutForm(req.body);
    }
    return next();
  }

  public async addItemToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    let cart: ShoppingCart | undefined = req.session.cart;
    let orderItem: OrderItem | null = <OrderItem>req.bindingModel;
    if (orderItem !== null) ShoppingCartHelper.addItem(<ShoppingCart>cart, orderItem);
    req.session.cart = cart;
    res.status(200).json({ 'message': 'Success' });
  }

  public async showCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    let cart: ShoppingCart | undefined = req.session.cart;
    ShoppingCartHelper.computeItemsData(<ShoppingCart>cart);
    let totalAmount: number = ShoppingCartHelper.getTotalAmount(<ShoppingCart>cart);
    let totalItem: number = ShoppingCartHelper.getTotalItem(<ShoppingCart>cart);
    let totalQuantity: number = ShoppingCartHelper.getTotalQuantity(<ShoppingCart>cart);
    let orderItems: OrderItem[] = ShoppingCartHelper.getItems(<ShoppingCart>cart);
    res.render('pages/shop/cart', { 'title': 'Cart', 'entries': orderItems, 'total_amount': totalAmount, 'total_quantity': totalQuantity, 'total_item': totalItem });
  }

  public async updateCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    let cart: ShoppingCart | undefined = req.session.cart;
    let orderItem: OrderItem | null = <OrderItem>req.bindingModel;
    ShoppingCartHelper.updateItem(<ShoppingCart>cart, orderItem.getItemId(), orderItem.getQuantity());
    req.session.cart = cart;
    res.redirect('/cart');
  }

  public async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    let cart: ShoppingCart | undefined = req.session.cart;
    ShoppingCartHelper.clearItems(<ShoppingCart>cart);
    req.session.cart = cart;
    res.redirect('/');
  }

  public async removeCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    let cart: ShoppingCart | undefined = req.session.cart;
    let item_id: number = isNaN(+(req.params.item_id)) ? 0 : +req.params.item_id;
    ShoppingCartHelper.removeItem(<ShoppingCart>cart, item_id);
    req.session.cart = cart;
    res.redirect('/cart');
  }

  public async verifyOrderItemExistingAndPrice(req: Request, res: Response, next: NextFunction): Promise<void> {
    let cart: ShoppingCart | undefined = req.session.cart;
    let orderItems: OrderItem[] = ShoppingCartHelper.getCartItems(<ShoppingCart>cart);
    let itemsExists: boolean = await this.service.verifyOrderItemExistingAndPrice(orderItems);
    if (itemsExists === false) {
      req.session.cart = new ShoppingCart();
      throw new CartItemsInvalidException();
    }

    return next();
  }

  public async proceedToCheckOut(req: Request, res: Response, next: NextFunction): Promise<void> {
    let cart: ShoppingCart | undefined = req.session.cart;
    let totalAmount: number = ShoppingCartHelper.getTotalAmount(<ShoppingCart>cart);
    let totalItem: number = ShoppingCartHelper.getTotalItem(<ShoppingCart>cart);
    let totalQuantity: number = ShoppingCartHelper.getTotalQuantity(<ShoppingCart>cart);

    if (totalItem === 0) return res.redirect('/');

    let countries: Country[] = await this.countryService.selectOnlyNameAndId();
    let paymentMethods: PaymentMethod[] = await this.paymentMethodService.selectOnlyNameAndId();
    let deliveryMethods: DeliveryMethod[] = await this.deliveryMethodService.selectOnlyNameAndId();

    res.render('pages/shop/checkout', {
      'total_amount': totalAmount, 'total_quantity': totalQuantity, 'total_item': totalItem,
      'countries': countries, 'paymentMethods': paymentMethods, 'deliveryMethods': deliveryMethods
    });
  }

  public async processCheckout(req: Request, res: Response, next: NextFunction): Promise<void> {
    let cart: ShoppingCart | undefined = req.session.cart;
    let checkoutForm: CheckoutForm | null = <CheckoutForm>req.bindingModel;
    let totalAmount: number = ShoppingCartHelper.getTotalAmount(<ShoppingCart>cart);
    let totalItem: number = ShoppingCartHelper.getTotalItem(<ShoppingCart>cart);
    let totalQuantity: number = ShoppingCartHelper.getTotalQuantity(<ShoppingCart>cart);

    if (totalItem === 0) return res.redirect('/');

    let countries: Country[] = [];
    let paymentMethods: PaymentMethod[] = [];
    let deliveryMethods: DeliveryMethod[] = [];

    if (req.validationErrors.isEmpty() === false) {
      countries = await this.countryService.selectOnlyNameAndId();
      paymentMethods = await this.paymentMethodService.selectOnlyNameAndId();
      deliveryMethods = await this.deliveryMethodService.selectOnlyNameAndId();

      res.render('pages/shop/checkout', {
        'entry': checkoutForm, 'total_amount': totalAmount, 'total_quantity': totalQuantity, 'total_item': totalItem,
        'countries': countries, 'paymentMethods': paymentMethods, 'deliveryMethods': deliveryMethods
      });
      return;
    }

    let userId = (<UserSession>req.user).getId();
    let order: Order | null = new Order({ 'quantity': totalQuantity, 'amount': totalAmount, 'user_id': userId });
    order.setUserId(userId);
    order.setPaymentMethodId(Number.parseInt(checkoutForm.getPaymentMethod()));
    order.setDeliveryMethodId(Number.parseInt(checkoutForm.getDeliveryMethod()));
    order.setCountryId(Number.parseInt(checkoutForm.getCountry()));
    order.setState(checkoutForm.getState());
    order.setCity(checkoutForm.getCity());
    order.setContactAddress(checkoutForm.getContactAddress());
    order.setPhoneNumber(checkoutForm.getPhoneNumber());
    order.setZip(checkoutForm.getZip());

    ShoppingCartHelper.setOrderItems((<ShoppingCart>cart).items, order);
    let transactionAuthorizationDetails: { [key: string]: any } = await this.paymentService.initializeTransaction(order);
    let data: { [key: string]: any } = transactionAuthorizationDetails.data;
    order.setOrderReference(data['reference']);
    order = await this.service.saveOrder(order);

    if (order === null) throw new Error('An error has occured');

    let authorizationUrl: string = data['authorization_url'];
    let user: UserSession = <UserSession>req.user;
    let datas: { [key: string]: any } = { 'reference': order.getOrderReference() };
    let mailMessage: MailMessage = new MailMessageImpl('Transaction Status', "");
    MailHelper.renderTemplateAndSend(res, 'templates/transaction-pending', this.mailSender, mailMessage, <any>user, datas);

    (<any>req.session).cart = {
      'items': [],
      'total_item': 0,
      'total_amount': 0,
      'total_quantity': 0
    } as any;
    res.redirect(authorizationUrl);
  }

  public async verifyOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    let reference: string | string[] | undefined = req.query.reference as string;
    let transactionDetails: any = await this.paymentService.verifyTransaction(reference);
    let paymentDetail: PaymentDetail = new PaymentDetail({});
    paymentDetail.setCardLastFourNumber(transactionDetails['authorization']['last4']);
    paymentDetail.setBankName(transactionDetails['authorization']['bank']);
    paymentDetail.setExpMonth(transactionDetails['authorization']['exp_month']);
    paymentDetail.setExpYear(transactionDetails['authorization']['exp_year']);
    paymentDetail.setCardType(transactionDetails['authorization']['card_type']);

    let user: User | null = await this.orderService.getOwnerOfOrder(reference);
    if (user === null) throw new Error("Non Existent owner of order");

    paymentDetail.setUser(user);
    let processed: boolean = false;

    if (transactionDetails.status === "success") { processed = await this.service.processPayment(paymentDetail, reference, "success"); }
    else { processed = await this.service.processPayment(paymentDetail, reference, "failed"); }

    let mailMessage: MailMessage | null = new MailMessageImpl('Transaction Completed', "");
    let status: string = "Unsuccessfully";

    if (processed === true) { if (transactionDetails.status === "success") { status = "Successfully"; } }
    else { throw new Error("An error has occured"); }

    let datas: { [key: string]: any } = { 'reference': reference, 'status': status };
    MailHelper.renderTemplateAndSend(res, 'templates/transaction-completed', this.mailSender, mailMessage, <any>user, datas);
    req.flash('success', `Transaction or Order ${status} processed.`);
    res.redirect('/order/user/entries');
  }

}