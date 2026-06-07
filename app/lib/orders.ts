export type OrderStatus =
  | "pending"
  | "accepted"
  | "cooking"
  | "ready"
  | "on_the_way"
  | "delivered";

export type Order = {
  id: string;
  items: any[];
  total: number;
  status: OrderStatus;
  createdAt: number;
};

class OrdersStore {
  orders: Order[] = [];

  create(items: any[], total: number) {
    const order = {
      id: Date.now().toString(),
      items,
      total,
      status: "pending" as OrderStatus,
      createdAt: Date.now(),
    };

    this.orders.push(order);
    return order;
  }

  get(id: string) {
    return this.orders.find(o => o.id === id);
  }

  updateStatus(id: string, status: OrderStatus) {
    const order = this.get(id);
    if (order) order.status = status;
  }
}

export const orders = new OrdersStore();