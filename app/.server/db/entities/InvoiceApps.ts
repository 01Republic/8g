import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { BillingHistories } from "./BillingHistories";
import { InvoiceAccounts } from "./InvoiceAccounts";
import { Products } from "./Products";

@Index("IDX_eeb8d9532b08e34cfecd57586f", ["invoiceAccountId", "productId"], {
  unique: true,
})
@Index("FK_df04fc36bc39ef4dac1e7f7f750", ["productId"], {})
@Entity("invoice_apps")
export class InvoiceApps extends BaseEntity {
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

  @Column("int", { name: "invoice_account_id" })
  invoiceAccountId: number;

  @Column("tinyint", { name: "is_active", default: () => "'1'" })
  isActive: number;

  @Column("int", { name: "product_id" })
  productId: number;

  @Column("enum", {
    name: "billing_type",
    enum: ["MONTHLY", "YEARLY", "ONETIME", "UNDEFINED"],
    default: () => "'UNDEFINED'",
  })
  billingType: "MONTHLY" | "YEARLY" | "ONETIME" | "UNDEFINED";

  @OneToMany(
    () => BillingHistories,
    (billingHistories) => billingHistories.invoiceApp,
  )
  billingHistories: BillingHistories[];

  @ManyToOne(
    () => InvoiceAccounts,
    (invoiceAccounts) => invoiceAccounts.invoiceApps,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "invoice_account_id", referencedColumnName: "id" }])
  invoiceAccount: InvoiceAccounts;

  @ManyToOne(() => Products, (products) => products.invoiceApps, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @RelationId((invoiceApps: InvoiceApps) => invoiceApps.invoiceAccount)
  invoiceAccountId2: number;

  @RelationId((invoiceApps: InvoiceApps) => invoiceApps.product)
  productId2: number;
}
