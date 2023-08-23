import { Model, PrimaryKey, Table, Column, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript";
import OrderItemsModel from "./order-item.model";
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

    @Column({allowNull: false})
    declare total: number;

    @Column({allowNull: false})
    declare discount: number;

    @Column({allowNull: false})
    declare order_date: Date;
}