import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Products } from "./Products";

@Entity("email_parsers")
export class EmailParsers extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "filterQuery", nullable: true })
  filterQuery: string | null;

  @Column("text", { name: "memo", nullable: true })
  memo: string | null;

  @Column("tinyint", { name: "isActive", default: () => "'0'" })
  isActive: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  updatedAt: Date;

  @Column("text", { name: "propertyParsers" })
  propertyParsers: string;

  @ManyToOne(() => Products, (products) => products.emailParsers, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @RelationId((emailParsers: EmailParsers) => emailParsers.product)
  productId: number;
}
