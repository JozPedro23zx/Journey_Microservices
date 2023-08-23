import { Model, PrimaryKey, Table, Column, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript";
import OrderItemsModel from "./order-item.model";
import PaymentModel from "./payment.model";
import { ClientModel } from "./client.model";

@Table({
    tableName: "order",
    timestamps: false
})
export default class OrderModel extends Model{
    @PrimaryKey
    @Column({allowNull: false})
    declare id: string;

    @ForeignKey(() => ClientModel)
    @Column({ allowNull: false })
    declare client_id: string; 

    @BelongsTo(() => ClientModel, { foreignKey: 'clientId' })
    declare client: ClientModel;

    @HasMany(() => OrderItemsModel)
    declare items: OrderItemsModel[];

    @HasMany(() => PaymentModel)
    declare payments: PaymentModel[];

    @Column({allowNull: false})
    declare status: string;

    @Column({allowNull: false})
    declare downpayment: number;

    @Column({allowNull: false})
    declare delivery_fee: number;

    @Column({allowNull: false})
    declare late_fee: number;

    @Column({allowNull: false})
    declare balance: number;

    @Column({allowNull: false})
    declare total: number;

    @Column({allowNull: false})
    declare discount: number;

    @Column({allowNull: false})
    declare order_date: Date;

    @Column({allowNull: false})
    declare return_date: Date;
}