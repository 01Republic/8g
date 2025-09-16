import { Column, Entity, Index } from "typeorm";

@Index("IDX_0c1b528a1e14678ac08fd83a67", ["invoiceAccountId"], {})
@Index("IDX_7810327f582c730163117cff5c", ["subscriptionId"], {})
@Index(
  "IDX_b37675525185db5c519d4d2abb",
  ["invoiceAccountId", "subscriptionId"],
  { unique: true }
)
@Entity("invoice_account_subscriptions")
export class InvoiceAccountSubscriptions {
  @Column("int", { primary: true, name: "invoice_account_id" })
  invoiceAccountId: number;

  @Column("int", { primary: true, name: "subscription_id" })
  subscriptionId: number;
}
