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
import { ProductPaymentPlans } from "./ProductPaymentPlans";
import { Products } from "./Products";
import { Subscriptions } from "./Subscriptions";

@Entity("product_billing_cycles")
export class ProductBillingCycles extends BaseEntity {
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

  @Column("float", { name: "unitPrice", precision: 12, default: () => "'0'" })
  unitPrice: number;

  @Column("enum", { name: "term", nullable: true, enum: ["MONTHLY", "YEARLY"] })
  term: "MONTHLY" | "YEARLY" | null;

  @Column("tinyint", { name: "isPerUser", default: () => "'1'" })
  isPerUser: number;

  @Column("varchar", { name: "adminComment", length: 255 })
  adminComment: string;

  @ManyToOne(
    () => ProductPaymentPlans,
    (productPaymentPlans) => productPaymentPlans.productBillingCycles,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "payment_plan_id", referencedColumnName: "id" }])
  paymentPlan: ProductPaymentPlans;

  @ManyToOne(() => Products, (products) => products.productBillingCycles, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @ManyToOne(
    () => ProductPaymentPlans,
    (productPaymentPlans) => productPaymentPlans.productBillingCycles2,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "payment_plan_id", referencedColumnName: "id" }])
  paymentPlan_2: ProductPaymentPlans;

  @ManyToOne(() => Products, (products) => products.productBillingCycles2, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product_2: Products;

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.billingCycle)
  subscriptions: Subscriptions[];

  @RelationId(
    (productBillingCycles: ProductBillingCycles) =>
      productBillingCycles.paymentPlan
  )
  paymentPlanId: number;

  @RelationId(
    (productBillingCycles: ProductBillingCycles) => productBillingCycles.product
  )
  productId: number;

  @RelationId(
    (productBillingCycles: ProductBillingCycles) =>
      productBillingCycles.paymentPlan_2
  )
  paymentPlanId2: number;

  @RelationId(
    (productBillingCycles: ProductBillingCycles) =>
      productBillingCycles.product_2
  )
  productId2: number;
}
