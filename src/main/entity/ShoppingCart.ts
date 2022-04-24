import { OrderItem } from './OrderItem';

export class ShoppingCart {

  public items: OrderItem[];
  public total_item: number;
  public total_amount: number;
  public total_quantity: number;

  constructor() {
    this.items = [];
    this.total_item = 0;
    this.total_amount = 0;
    this.total_quantity = 0;
  }

  public getItems(): OrderItem[] {
    return this.items;
  }

  public setItems(items: OrderItem[]) {
    this.items = items;
  }

  public setTotalAmount(total_amount: number) {
    this.total_amount = total_amount;
  }

  public setTotalItem(total_item: number): void {
    this.total_item = total_item;
  }

  public setTotalQuantity(total_quantity: number): void {
    this.total_quantity = total_quantity;
  }

  public clearItems() {
    this.items = [];
  }

  public getTotalAmount(): number {
    let totalAmt: number = 0;
    this.items.forEach((item: OrderItem) => { totalAmt += item.getAmount(); });
    return totalAmt;
  }

  public getTotalItem(): number {
    return this.items.length - 1;
  }

  public getTotalQuantity(): number {
    let total_quantity: number = 0;
    this.items.forEach((item: OrderItem) => { total_quantity += item.getQuantity(); });
    return total_quantity;
  }

  public removeItem(itemId: number) {
    let orderItem: OrderItem | null = this.getItem(itemId);
    this.items = this.items.filter((item: OrderItem) => {
      if (item.getItemId() !== itemId) { return true; }
      else { return false; }
    });

    if (this.items.length > 0 && orderItem !== null) { --this.total_item; }
    if (orderItem !== null) this.total_amount -= orderItem.getAmount();
  }

  public addItem(item: OrderItem): void {
    let itemIndex: number = this.items.length;
    this.items.forEach((existingItem: OrderItem, idx: number) => {
      if (existingItem.getItemId() === item.getItemId()) {
        itemIndex = idx;
      }
    });

    if (itemIndex !== this.items.length && item.getQuantity() !== 0) {
      item.setQuantity(item.getQuantity() + 1);
      this.items[itemIndex] = item;
    }
    else if (itemIndex === this.items.length && item.getQuantity() !== 0) {
      this.items[this.items.length] = item;
    }
    else {
      this.removeItem(item.getItemId());
      return;
    }

    ++this.total_item;
    this.total_amount += item.getAmount();
  }

  private getItem(itemId: number): OrderItem | null {
    let itemIndex: number = this.items.findIndex((existingItem: OrderItem, idx: number) => {
      if (existingItem.getItemId() === itemId) {
        return true;
      }
    });

    let orderItem: OrderItem = this.items[itemIndex];
    if (orderItem !== null && orderItem !== undefined) { return orderItem; }
    else {
      return null;
    }
  }

  private setitem(itemIndex: number, item: OrderItem): void {
    this.items[itemIndex] = item;
  }

  public updateItem(itemId: number, quantity: number): void {
    if ((+quantity) < 1 && this.getItem(itemId) !== null) {
      this.removeItem(itemId);
      return;
    }

    let itemIndex: number = this.items.findIndex((existingItem: OrderItem, idx: number) => {
      if (existingItem.getItemId() === itemId) {
        return true;
      }
    });

    let orderItem: OrderItem | null = this.getItem(itemIndex);
    if (orderItem !== null) { orderItem.setQuantity(quantity); }
    this.setitem(itemIndex, <OrderItem>orderItem);
  }
}