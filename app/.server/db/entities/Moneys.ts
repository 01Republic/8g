import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BillingHistories } from "./BillingHistories";
import { GmailItemBillingInfo } from "./GmailItemBillingInfo";
import { Subscriptions } from "./Subscriptions";

@Entity("moneys")
export class Moneys extends BaseEntity {
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

  @Column("varchar", { name: "text", length: 255 })
  text: string;

  @Column("varchar", { name: "format", length: 255, default: () => "'%n'" })
  format: string;

  @Column("varchar", { name: "symbol", length: 255 })
  symbol: string;

  @Column("float", { name: "amount", precision: 12 })
  amount: number;

  @Column("float", {
    name: "exchange_rate",
    precision: 12,
    default: () => "'1'",
  })
  exchangeRate: number;

  @Column("enum", {
    name: "code",
    enum: [
      "USD",
      "KRW",
      "EUR",
      "GBP",
      "CAD",
      "CNY",
      "JPY",
      "VND",
      "ARS",
      "INR",
      "TWD",
    ],
    default: () => "'USD'",
  })
  code:
    | "USD"
    | "KRW"
    | "EUR"
    | "GBP"
    | "CAD"
    | "CNY"
    | "JPY"
    | "VND"
    | "ARS"
    | "INR"
    | "TWD";

  @Column("enum", {
    name: "exchanged_currency",
    enum: [
      "USD",
      "KRW",
      "EUR",
      "GBP",
      "CAD",
      "CNY",
      "JPY",
      "VND",
      "ARS",
      "INR",
      "TWD",
    ],
    default: () => "'USD'",
  })
  exchangedCurrency:
    | "USD"
    | "KRW"
    | "EUR"
    | "GBP"
    | "CAD"
    | "CNY"
    | "JPY"
    | "VND"
    | "ARS"
    | "INR"
    | "TWD";

  @Column("float", { name: "dollarPrice", precision: 12, default: () => "'0'" })
  dollarPrice: number;

  @OneToOne(
    () => BillingHistories,
    (billingHistories) => billingHistories.vatAmount
  )
  billingHistories: BillingHistories;

  @OneToOne(
    () => BillingHistories,
    (billingHistories) => billingHistories.payAmount
  )
  billingHistories2: BillingHistories;

  @OneToOne(
    () => GmailItemBillingInfo,
    (gmailItemBillingInfo) => gmailItemBillingInfo.payAmount
  )
  gmailItemBillingInfo: GmailItemBillingInfo;

  @OneToOne(
    () => Subscriptions,
    (subscriptions) => subscriptions.currentBillingAmount
  )
  subscriptions: Subscriptions;
}
