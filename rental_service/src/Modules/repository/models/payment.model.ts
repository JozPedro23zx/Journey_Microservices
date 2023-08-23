import { Model, PrimaryKey, Table, Column, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript";
import OrderModel from "./order.model";

@Table({
    tableName: "payment",
    timestamps: false
})
export default class PaymentModel extends Model{
    @PrimaryKey
    @Column({allowNull: false})
    declare id: string;

    @ForeignKey(() => OrderModel)
    declare order_id: string;

    @Column({allowNull: false})
    declare payment_type: string;

    @Column({allowNull: false})
    declare descripition: string;

    @Column({allowNull: false})
    declare amount: number;

    @Column({allowNull: false})
    declare payment_date: Date;
}