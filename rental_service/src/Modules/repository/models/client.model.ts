import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";


@Table({
  tableName: "clients",
  timestamps: false,
})
export class ClientModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @HasMany(() => OrderModel)
  order: OrderModel[]

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  email: string;
}
