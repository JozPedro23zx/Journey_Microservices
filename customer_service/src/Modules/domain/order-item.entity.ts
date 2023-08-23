import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "./product.entity";


type OrderItemProps = {
    id?: Id;
    orderId: Id;
    product: Product;
    qtd: number; 
    total: number
};

export default class OrderItem extends BaseEntity implements AggregateRoot {
    private _orderId: Id;
    private _product: Product;
    private _qtd: number; 
    private _total: number
  
    constructor(props: OrderItemProps) {
      super(props.id);
      this._orderId = props.orderId;
      this._product = props.product;
      this._qtd = props.qtd;
      this._total = props.total;
    }
  
    get orderId(): Id {
      return this._orderId;
    }

    get product(): Product {
        return this._product;
    }

    get qtd(): number {
        return this._qtd;
    }

    get total(): number {
        return this._total;
    }
  }