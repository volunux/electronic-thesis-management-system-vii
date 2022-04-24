import { OrderItem } from '../../entity/OrderItem';
import { Order } from '../../entity/Order';
import { ShoppingCart } from '../../entity/ShoppingCart';

export class ShoppingCartHelper {

  private items : OrderItem[];
  private totalItem : number;
  private totalAmount : number;
  private totalQuantity : number;

  constructor() {
    this.items = [];
    this.totalItem = 0;
    this.totalAmount = 0;
    this.totalQuantity = 0;
  }

  public static getItems(cart : ShoppingCart) : OrderItem[] {
    if (cart === null || cart === undefined) return [];
    return cart.items;
  }

  public setItems(items : OrderItem[]) {
    this.items = items;
  }

  public setTotalAmount(total_amount :  number) {
    this.totalAmount = total_amount;
  }

  public setTotalItem(total_item : number) : void {
    this.totalItem = total_item;
  }

  public setTotalQuantity(total_quantity : number) : void {
    this.totalQuantity = total_quantity;
  }

  public static clearItems(cart : ShoppingCart) : void {
    cart.items = [];
    cart.total_item =  cart.items.length;
    cart.total_amount = 0;
    cart.total_quantity = 0;
  }

  public static getTotalAmount(cart : ShoppingCart) : number {
    let totalAmt : number = 0;
    if (cart !== null && cart !== undefined) cart.items.forEach(function(item : OrderItem) : void { totalAmt += ShoppingCartHelper.getItemTotalAmount(item); });
    return totalAmt;
  }

  public static getTotalItem(cart : ShoppingCart) : number {
    return cart.items.length;
  }

  public static getTotalQuantity(cart : ShoppingCart) : number {
    let totalQuantity : number = 0;
    if (cart !== null && cart !== undefined) cart.items.forEach(function(item : OrderItem) : void { totalQuantity += item.quantity; });
    return totalQuantity;
  }

  public static removeItem(cart : ShoppingCart , item_id : number) : void {
    let orderItem : OrderItem | null = ShoppingCartHelper.getItem(cart , item_id);
    cart.items = cart.items.filter(function(existingItem : OrderItem) : unknown {
      if (existingItem.item_id !== item_id) { return true; }
      else { return false; } });

    if (cart.items.length > 0 && orderItem !== null) { --cart.total_item;
      cart.total_amount -= ShoppingCartHelper.getItemTotalAmount(orderItem); }
  }

  public static getItemTotalAmount(orderItem : OrderItem) : number { return orderItem.unit_price * orderItem.quantity; }

  public static addItem(cart : ShoppingCart , item : OrderItem) : void {
    if (cart !== null && cart.items !== null) {
      let item_index : number = cart.items.length;
      cart.items.forEach(function(existingItem : OrderItem , idx : number) : void {
        if (existingItem.item_id === item.item_id) {
          item_index = +idx; } });

    if (item_index !== cart.items.length && item.quantity !== 0) {
      let existingItem : OrderItem = cart.items[item_index];
      existingItem.quantity = existingItem.quantity + 1;
      cart.items[item_index] = existingItem; }
    else if (item_index === cart.items.length && item.quantity !== 0) { cart.items[cart.items.length] = item; }
    else { ShoppingCartHelper.removeItem(cart , item.item_id);
      return; }

    ++cart.total_item;
    cart.total_amount += ShoppingCartHelper.getItemTotalAmount(item); }
  }

  public static itemExists(cart : ShoppingCart , item_id : number) : boolean {
    let item_index : number = cart.items.findIndex(function(existingItem : any , idx : number) : unknown {
    if (existingItem.item_id === item_id) { return true; } });

    if (item_index > -1) { return true; }
    else { return false; }
  }

  public static computeItemsData(cart : ShoppingCart) : ShoppingCart | null {
    if (cart !== null && cart !== undefined) {
      cart.items = cart.items.map(function(item : OrderItem) : OrderItem { item.amount = ShoppingCartHelper.getItemTotalAmount(item);
        return item; });
      return cart; }
    else { return null; }
  }

  private static getItem(cart : ShoppingCart , item_id : number) : OrderItem | null {
    let item_index : number = cart.items.findIndex(function(existingItem : OrderItem , idx : number) : unknown {
      if (existingItem.item_id === item_id) { return true; } });
    let orderItem : any = cart.items[item_index];
    if (orderItem !== null && orderItem !== undefined) { return orderItem; }
    else { return null; }
  }

  private static setitem(cart : ShoppingCart , item_index : number , item : OrderItem) : void { cart.items[item_index] = item; }

  public static updateItem(cart : ShoppingCart , item_id : number , quantity : number) : void {
    let orderItem : OrderItem | null = ShoppingCartHelper.getItem(cart , item_id);
    if (quantity < 1 && orderItem !== null) { ShoppingCartHelper.removeItem(cart , item_id);
      return; }
    let item_index : number = cart.items.findIndex(function(existingItem : OrderItem , idx : number) : unknown {
    if (existingItem.item_id === item_id) { return true; } });
    if (orderItem !== null) { orderItem.quantity = quantity; }
    ShoppingCartHelper.setitem(cart , item_index , <OrderItem>orderItem);
  }

  public static setOrderItems(items : OrderItem[] , order : Order) : void {
    let orderItems : OrderItem[] = [];
    if (items !== null && items !== undefined) {
      items.forEach((item : OrderItem) => {
        let orderItem : OrderItem = new OrderItem(item.item_id , <string>item.title , item.unit_price , item.order_id);
        orderItem.setQuantity(item.quantity);
        orderItem.setAmount(orderItem.getQuantity() * orderItem.getUnitPrice());
        orderItems.push(orderItem); });
    order.setOrderItems(orderItems); }
  }

  public static getCartItems(cart : ShoppingCart) : OrderItem[] {
    let orderItems : OrderItem[] = [];
    if (cart !== null && cart !== undefined) {
      cart.items.forEach((item : OrderItem) => {
      let orderItem : OrderItem = new OrderItem(item.item_id , <any>item.title , item.unit_price , item.order_id);
        orderItems.push(orderItem); }); }
    return orderItems;
  }



}