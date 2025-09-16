import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BillingHistories } from "./BillingHistories";
import { InvoiceAccounts } from "./InvoiceAccounts";

@Index("FK_df04fc36bc39ef4dac1e7f7f750", ["productId"], {})
@Index("IDX_eeb8d9532b08e34cfecd57586f", ["invoiceAccountId", "productId"], {
  unique: true,
})
@Entity("invoice_apps")
export class InvoiceApps {
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
    (billingHistories) => billingHistories.invoiceApp
  )
  billingHistories: BillingHistories[];

  @ManyToOne(
    () => InvoiceAccounts,
    (invoiceAccounts) => invoiceAccounts.invoiceApps,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "invoice_account_id", referencedColumnName: "id" }])
  invoiceAccount: InvoiceAccounts;
}
