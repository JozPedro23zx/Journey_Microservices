import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
  id?: Id;
  name: string;
};

export default class Product extends BaseEntity implements AggregateRoot {
  private _name: string;

  constructor(props: ProductProps) {
    super(props.id);
    this._name = props.name;
  }

  get name(): string {
    return this._name;
  }
}