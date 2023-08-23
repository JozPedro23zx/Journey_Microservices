import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
  id?: Id;
  name: string;
  description: string;
  price: number;
  qtdAvailable: number;
  qtdTotal: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Product extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _description: string;
  private _price: number;
  private _qtdAvailable: number;
  private _qtdTotal: number;

  constructor(props: ProductProps) {
    super(props.id);
    this._name = props.name;
    this._description = props.description;
    this._price = props.price;
    this._qtdAvailable = props.qtdAvailable;
    this._qtdTotal = props.qtdTotal;

  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get qtdAvailable(): number {
    return this._qtdAvailable;
  }

  get qtdTotal(): number {
    return this._qtdTotal;
  }

  set name(name: string) {
    this._name = name;
  }

  set qtdAvailable(stock: number) {
    this.qtdAvailable = stock;
  }

  set qtdTotal(stock: number) {
    this.qtdTotal = stock;
  }

  set description(description: string) {
    this._description = description;
  }

  set price(price: number) {
    this._price = price;
  }
}