import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "./client.entity";
import OrderItem from "./order-item.entity";

type OrderProps = {
    id?: Id;
    client: Client;
    items: OrderItem[];
    discount: number;
    total: number;
    orderDate: Date;
  };

  export default class Order extends BaseEntity implements AggregateRoot {
    private _client: Client;
    private _items: OrderItem[];
    private _discount: number;
    private _total: number;
    private _orderDate: Date;

    constructor(props: OrderProps){
        super(props.id);
        this._client = props.client;
        this._items = props.items;
        this._discount = props.discount;
        this._total = props.total
        this._orderDate = props.orderDate;
    }

    get client(): Client {
        return this._client;
    }

    get items(): OrderItem[] {
        return this._items
    }

    get discount(): number {
        return this._discount;
    }

    get total(): number {
      return this._total
    }

    get orderDate(): Date {
        return this._orderDate;
    }

    // set deleteItem()
  }