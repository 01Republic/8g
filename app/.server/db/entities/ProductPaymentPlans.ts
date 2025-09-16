import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductBillingCycles } from "./ProductBillingCycles";
import { Products } from "./Products";

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

  @ManyToOne(() => Products, (products) => products.productPaymentPlans, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;
}
