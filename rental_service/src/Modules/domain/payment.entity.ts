import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";

type PaymentProps = {
  id?: Id;
  orderId: string;
  paymentType: string;
  descripition: string;
  amount: number;
  paymentDate: Date;
};

export default class Payment extends BaseEntity implements AggregateRoot {
    private _orderId: string;
    private _paymentType: string;
    private _descripition: string;
    private _amount: number;
    private _paymentDate: Date;

  constructor(props: PaymentProps) {
    super(props.id);
    this._orderId = props.orderId;
    this._paymentType = props.paymentType;
    this._descripition = props.descripition;
    this._amount = props.amount;
    this._paymentDate = props.paymentDate;

  }

  get order(): string {
    return this._orderId;
  }

  get paymentType(): string {
    return this._paymentType;
  }

  get descripition(): string {
    return this._descripition;
  }

  get amount(): number {
    return this._amount;
  }

  get paymentDate(): Date {
    return this._paymentDate;
  }
}