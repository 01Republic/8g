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
import { Users } from "./Users";

@Entity("product_added_alerts")
export class ProductAddedAlerts extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("datetime", { name: "noticed_at", nullable: true })
  noticedAt: Date | null;

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

  @ManyToOne(() => Products, (products) => products.productAddedAlerts, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @ManyToOne(() => Products, (products) => products.productAddedAlerts2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product_2: Products;

  @ManyToOne(() => Users, (users) => users.productAddedAlerts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Users, (users) => users.productAddedAlerts2, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user_2: Users;

  @RelationId(
    (productAddedAlerts: ProductAddedAlerts) => productAddedAlerts.product
  )
  productId: number;

  @RelationId(
    (productAddedAlerts: ProductAddedAlerts) => productAddedAlerts.product_2
  )
  productId2: number;

  @RelationId(
    (productAddedAlerts: ProductAddedAlerts) => productAddedAlerts.user
  )
  userId: number;

  @RelationId(
    (productAddedAlerts: ProductAddedAlerts) => productAddedAlerts.user_2
  )
  userId2: number;
}
