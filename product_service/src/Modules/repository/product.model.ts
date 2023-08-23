import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "productsAdm",
  timestamps: false,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  price: number;

  @Column({ allowNull: false })
  qtdAvailable: number;

  @Column({ allowNull: false })
  qtdTotal: number;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}
