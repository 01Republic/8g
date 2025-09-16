import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { ProductBillingCycles } from "./ProductBillingCycles";
import { Products } from "./Products";
import { Subscriptions } from "./Subscriptions";

@Entity("product_payment_plans")
export class ProductPaymentPlans extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

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

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @OneToMany(
    () => ProductBillingCycles,
    (productBillingCycles) => productBillingCycles.paymentPlan
  )
  productBillingCycles: ProductBillingCycles[];

  @OneToMany(
    () => ProductBillingCycles,
    (productBillingCycles) => productBillingCycles.paymentPlan_2
  )
  productBillingCycles2: ProductBillingCycles[];

  @ManyToOne(() => Products, (products) => products.productPaymentPlans, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @ManyToOne(() => Products, (products) => products.productPaymentPlans2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product_2: Products;

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.paymentPlan)
  subscriptions: Subscriptions[];

  @RelationId(
    (productPaymentPlans: ProductPaymentPlans) => productPaymentPlans.product
  )
  productId: number;

  @RelationId(
    (productPaymentPlans: ProductPaymentPlans) => productPaymentPlans.product_2
  )
  productId2: number;
}
