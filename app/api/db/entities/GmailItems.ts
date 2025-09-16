import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BillingHistories } from "./BillingHistories";
import { GmailItemBillingInfo } from "./GmailItemBillingInfo";
import { Organizations } from "./Organizations";
import { InvoiceAccounts } from "./InvoiceAccounts";

@Index("gmail_item_identity", ["invoiceAccountId", "mailId"], {})
@Index("IDX_842c4d662a979a73a55ed67449", ["mailId"], {})
@Entity("gmail_items")
export class GmailItems {
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

  @Column("varchar", { name: "mailId", length: 255 })
  mailId: string;

  @Column("varchar", { name: "threadId", length: 255 })
  threadId: string;

  @Column("varchar", { name: "snippet", length: 255 })
  snippet: string;

  @Column("int", { name: "sizeEstimate" })
  sizeEstimate: number;

  @Column("varchar", { name: "historyId", length: 255 })
  historyId: string;

  @Column("varchar", { name: "internalDate", length: 255 })
  internalDate: string;

  @Column("text", { name: "metadata" })
  metadata: string;

  @Column("text", { name: "attachments" })
  attachments: string;

  @Column("text", { name: "headers" })
  headers: string;

  @Column("int", { name: "billingHistoryId", nullable: true })
  billingHistoryId: number | null;

  @Column("tinyint", { name: "isRelated", nullable: true })
  isRelated: number | null;

  @Column("datetime", { name: "parsedAt", nullable: true })
  parsedAt: Date | null;

  @Column("datetime", { name: "checkedAt", nullable: true })
  checkedAt: Date | null;

  @Column("text", { name: "contentUrl" })
  contentUrl: string;

  @Column("varchar", { name: "title", nullable: true, length: 255 })
  title: string | null;

  @Column("varchar", { name: "from", nullable: true, length: 255 })
  from: string | null;

  @ManyToOne(
    () => BillingHistories,
    (billingHistories) => billingHistories.gmailItems,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "billing_history_id", referencedColumnName: "id" }])
  billingHistory: BillingHistories;

  @OneToOne(
    () => GmailItemBillingInfo,
    (gmailItemBillingInfo) => gmailItemBillingInfo.gmailItems,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "billingInfoId", referencedColumnName: "id" }])
  billingInfo: GmailItemBillingInfo;

  @ManyToOne(() => Organizations, (organizations) => organizations.gmailItems, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(
    () => InvoiceAccounts,
    (invoiceAccounts) => invoiceAccounts.gmailItems,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "invoice_account_id", referencedColumnName: "id" }])
  invoiceAccount: InvoiceAccounts;
}
