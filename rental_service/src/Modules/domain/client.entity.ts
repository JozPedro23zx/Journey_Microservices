import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";

type ClientProps = {
  id?: Id;
  name: string;
  email: string;
};

export default class Client extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _email: string;

  constructor(props: ClientProps) {
    super(props.id);
    this._name = props.name;
    this._email = props.email;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }
}
