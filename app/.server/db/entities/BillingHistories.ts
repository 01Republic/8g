import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { InvoiceApps } from "./InvoiceApps";
import { CreditCard } from "./CreditCard";
import { Subscriptions } from "./Subscriptions";
import { CodefBillingHistories } from "./CodefBillingHistories";
import { Moneys } from "./Moneys";
import { Organizations } from "./Organizations";
import { BankAccounts } from "./BankAccounts";
import { GmailItems } from "./GmailItems";

@Index("IDX_f06edc9547c4d7ad4765cca250", ["payAmountId"], { unique: true })
@Index(
  "IDX_2b9f9da89be5f6075f32c36814",
  ["subscriptionId", "invoiceAppId", "emailOriginId"],
  { unique: true },
)
@Index("IDX_e0a2c11070e06d088ba32daec7", ["vatAmountId"], { unique: true })
@Index("IDX_eba28a7542aa10d69fd1dd8ff1", ["abroadPayAmountId"], {
  unique: true,
})
@Index("REL_eba28a7542aa10d69fd1dd8ff1", ["abroadPayAmountId"], {
  unique: true,
})
@Index("FK_4192c9c974488705ec4610b0282", ["subscriptionId"], {})
@Index("IDX_e8124120a3148ce8dd00624645", ["emailOriginId"], {})
@Entity("billing_histories")
export class BillingHistories extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "uid", nullable: true, length: 255 })
  uid: string | null;

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

  @Column("int", { name: "subscription_id", nullable: true })
  subscriptionId: number | null;

  @Column("datetime", { name: "paid_at", nullable: true })
  paidAt: Date | null;

  @Column("text", { name: "invoice_url", nullable: true })
  invoiceUrl: string | null;

  @Column("datetime", { name: "issued_at" })
  issuedAt: Date;

  @Column("varchar", { name: "payment_method", length: 255 })
  paymentMethod: string;

  @Column("int", { name: "pay_amount_id", nullable: true, unique: true })
  payAmountId: number | null;

  @Column("int", { name: "invoice_app_id", nullable: true })
  invoiceAppId: number | null;

  @Column("text", { name: "email_content", nullable: true })
  emailContent: string | null;

  @Column("datetime", { name: "last_requested_at", nullable: true })
  lastRequestedAt: Date | null;

  @Column("varchar", { name: "email_origin_id", nullable: true, length: 255 })
  emailOriginId: string | null;

  @Column("text", { name: "memo", nullable: true })
  memo: string | null;

  @Column("tinyint", { name: "is_domestic", nullable: true })
  isDomestic: number | null;

  @Column("tinyint", { name: "is_vat_deductible", nullable: true })
  isVatDeductible: number | null;

  @Column("int", { name: "vat_amount_id", nullable: true, unique: true })
  vatAmountId: number | null;

  @Column("int", { name: "abroad_pay_amount_id", nullable: true, unique: true })
  abroadPayAmountId: number | null;

  @Column("varchar", { name: "gmail_content_id", nullable: true, length: 255 })
  gmailContentId: string | null;

  @Column("varchar", { name: "card_approve_no", nullable: true, length: 255 })
  cardApproveNo: string | null;

  @Column("enum", {
    name: "connectMethod",
    nullable: true,
    enum: ["MANUAL", "CARD", "BANK", "EMAIL"],
  })
  connectMethod: "MANUAL" | "CARD" | "BANK" | "EMAIL" | null;

  @ManyToOne(() => InvoiceApps, (invoiceApps) => invoiceApps.billingHistories, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "invoice_app_id", referencedColumnName: "id" }])
  invoiceApp: InvoiceApps;

  @ManyToOne(() => CreditCard, (creditCard) => creditCard.billingHistories, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "credit_card_id", referencedColumnName: "id" }])
  creditCard: CreditCard;

  @ManyToOne(
    () => Subscriptions,
    (subscriptions) => subscriptions.billingHistories,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "subscription_id", referencedColumnName: "id" }])
  subscription: Subscriptions;

  @ManyToOne(
    () => CodefBillingHistories,
    (codefBillingHistories) => codefBillingHistories.billingHistories,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" },
  )
  @JoinColumn([
    { name: "codef_billing_history_id", referencedColumnName: "id" },
  ])
  codefBillingHistory: CodefBillingHistories;

  @OneToOne(() => Moneys, (moneys) => moneys.billingHistories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "vat_amount_id", referencedColumnName: "id" }])
  vatAmount: Moneys;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.billingHistories,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @OneToOne(() => Moneys, (moneys) => moneys.billingHistories2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "pay_amount_id", referencedColumnName: "id" }])
  payAmount: Moneys;

  @ManyToOne(
    () => BankAccounts,
    (bankAccounts) => bankAccounts.billingHistories,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "bank_account_id", referencedColumnName: "id" }])
  bankAccount: BankAccounts;

  @OneToMany(() => GmailItems, (gmailItems) => gmailItems.billingHistory)
  gmailItems: GmailItems[];

  @RelationId(
    (billingHistories: BillingHistories) => billingHistories.invoiceApp,
  )
  invoiceAppId2: number | null;

  @RelationId(
    (billingHistories: BillingHistories) => billingHistories.creditCard,
  )
  creditCardId: number | null;

  @RelationId(
    (billingHistories: BillingHistories) => billingHistories.subscription,
  )
  subscriptionId2: number | null;

  @RelationId(
    (billingHistories: BillingHistories) =>
      billingHistories.codefBillingHistory,
  )
  codefBillingHistoryId: number | null;

  @RelationId(
    (billingHistories: BillingHistories) => billingHistories.vatAmount,
  )
  vatAmountId2: number | null;

  @RelationId(
    (billingHistories: BillingHistories) => billingHistories.organization,
  )
  organizationId: number;

  @RelationId(
    (billingHistories: BillingHistories) => billingHistories.payAmount,
  )
  payAmountId2: number | null;

  @RelationId(
    (billingHistories: BillingHistories) => billingHistories.bankAccount,
  )
  bankAccountId: number | null;
}
