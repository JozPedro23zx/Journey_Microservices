import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "./client.entity";
import OrderItem from "./order-item.entity";
import Payment from "./payment.entity";

type OrderProps = {
    id?: Id;
    client: Client;
    items: OrderItem[];
    payments: Payment[];
    status: string;
    downpayment: number;
    deliveryFee: number;
    lateFee: number;
    discount: number;
    orderDate: Date;
  };

  export default class Order extends BaseEntity implements AggregateRoot {
    private _client: Client;
    private _items: OrderItem[];
    private _payments: Payment[];
    private _status: string;
    private _downpayment: number;
    private _deliveryFee: number;
    private _lateFee: number;
    private _discount: number;
    private _orderDate: Date;


    constructor(props: OrderProps){
        super(props.id);
        this._client = props.client;
        this._items = props.items;
        this._discount = props.discount;
        this._orderDate = props.orderDate;
        this._payments = props.payments;
        this._status = props.status;
        this._downpayment = props.downpayment;
        this._deliveryFee = props.deliveryFee;
        this._lateFee = props.lateFee;
    }

    get client(): Client {
        return this._client;
    }

    get payments(): Payment[] {
      return this._payments;
    }

    get status(): string {
      return this._status;
    }

    get downpayment(): number {
      return this._downpayment;
    }

    get deliveryFee(): number {
      return this._deliveryFee;
    }

    get lateFee(): number {
      return this._lateFee;
    }

    
    get items(): OrderItem[] {
      return this._items;
    }
  
    get discount(): number {
      return this._discount;
    }
  
  
    get itemsTotal(): number{
      let totalItems = 0 ;
      this._items.forEach(item => {
        totalItems += item.product.price * item.qtd;
      });
      return totalItems;
    }
  
    get total(): number {
      return this.itemsTotal +  this._lateFee + this._deliveryFee - this._discount;
    }

    get totalPayment(): number{
      let total = 0;
      this._payments.forEach(payment => {
        total += payment.amount;
      });
      return total;
    }
  
    get balance(): number {
        return this.total - this.totalPayment
    }

    get orderDate(): Date {
        return this._orderDate;
    }

    get returnDate(): Date {
      let day = this._orderDate
      let return_date = new Date(day.setDate(day.getDay() + 12))
      return return_date
    }

    // set deleteItem()
}