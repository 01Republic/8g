import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Moneys } from "./Moneys";
import { GmailItems } from "./GmailItems";

@Entity("gmail_item_billing_info")
export class GmailItemBillingInfo {
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

  @Column("datetime", { name: "issuedAt" })
  issuedAt: Date;

  @Column("datetime", { name: "lastRequestedAt", nullable: true })
  lastRequestedAt: Date | null;

  @Column("datetime", { name: "paidAt", nullable: true })
  paidAt: Date | null;

  @Column("varchar", { name: "paymentMethod", nullable: true, length: 255 })
  paymentMethod: string | null;

  @Column("enum", {
    name: "assumedBillingType",
    enum: ["MONTHLY", "YEARLY", "ONETIME", "UNDEFINED"],
    default: () => "'UNDEFINED'",
  })
  assumedBillingType: "MONTHLY" | "YEARLY" | "ONETIME" | "UNDEFINED";

  @Column("varchar", { name: "workspaceName", nullable: true, length: 255 })
  workspaceName: string | null;

  @OneToOne(() => Moneys, (moneys) => moneys.gmailItemBillingInfo, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "pay_amount_id", referencedColumnName: "id" }])
  payAmount: Moneys;

  @OneToOne(() => GmailItems, (gmailItems) => gmailItems.billingInfo)
  gmailItems: GmailItems;
}
