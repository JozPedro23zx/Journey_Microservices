import { Model, PrimaryKey, Table, Column, BelongsTo, HasMany, ForeignKey } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import OrderModel from "./order.model";


@Table({
    tableName: "order_items",
    timestamps: false
})

export default class OrderItemsModel extends Model{
    @PrimaryKey
    @Column({allowNull: false})
    declare id: string;

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare product_id: string; 
    
    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare order_id: string; 

    @BelongsTo(() => ProductModel, {foreignKey: "product_id"})
    declare product: ProductModel;

    @Column({allowNull: false})
    declare qtd: number;

    @Column({allowNull: false})
    declare total: number;
}