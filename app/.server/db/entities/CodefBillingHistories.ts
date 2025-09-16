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
import { CodefBankAccountParsers } from "./CodefBankAccountParsers";
import { CodefBankAccounts } from "./CodefBankAccounts";
import { CodefCardParsers } from "./CodefCardParsers";
import { CodefCards } from "./CodefCards";

@Index("IDX_9cd4f4349c1f09d455be116b3c", ["identifyKey"], {})
@Index("FK_a3ea46f2562cec5c486c082469a", ["billingHistoryId"], {})
@Entity("codef_billing_histories")
export class CodefBillingHistories extends BaseEntity {
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

  @Column("tinyint", { name: "fromApproval", default: () => "'0'" })
  fromApproval: number;

  @Column("tinyint", { name: "fromPurchase", default: () => "'0'" })
  fromPurchase: number;

  @Column("tinyint", { name: "fromTransaction", default: () => "'0'" })
  fromTransaction: number;

  @Column("datetime", { name: "usedAt" })
  usedAt: Date;

  @Column("varchar", { name: "identifyKey", length: 255 })
  identifyKey: string;

  @Column("tinyint", { name: "isForeign" })
  isForeign: number;

  @Column("bigint", { name: "finalPrice" })
  finalPrice: string;

  @Column("varchar", { name: "resUsedDate", length: 255 })
  resUsedDate: string;

  @Column("varchar", { name: "resUsedTime", length: 255 })
  resUsedTime: string;

  @Column("varchar", { name: "resCardNo", length: 255 })
  resCardNo: string;

  @Column("varchar", { name: "resCardNo1", length: 255 })
  resCardNo1: string;

  @Column("varchar", { name: "resCardName", length: 255 })
  resCardName: string;

  @Column("varchar", { name: "resMemberStoreName", length: 255 })
  resMemberStoreName: string;

  @Column("varchar", { name: "resUsedAmount", length: 255 })
  resUsedAmount: string;

  @Column("varchar", { name: "resPaymentType", length: 255 })
  resPaymentType: string;

  @Column("varchar", { name: "resInstallmentMonth", length: 255 })
  resInstallmentMonth: string;

  @Column("varchar", { name: "resAccountCurrency", length: 255 })
  resAccountCurrency: string;

  @Column("varchar", { name: "resApprovalNo", length: 255 })
  resApprovalNo: string;

  @Column("varchar", { name: "resPaymentDueDate", length: 255 })
  resPaymentDueDate: string;

  @Column("varchar", { name: "resHomeForeignType", length: 255 })
  resHomeForeignType: string;

  @Column("varchar", { name: "resMemberStoreType", length: 255 })
  resMemberStoreType: string;

  @Column("varchar", { name: "resMemberStoreNo", length: 255 })
  resMemberStoreNo: string;

  @Column("varchar", { name: "resMemberStoreCorpNo", length: 255 })
  resMemberStoreCorpNo: string;

  @Column("varchar", { name: "resMemberStoreTelNo", length: 255 })
  resMemberStoreTelNo: string;

  @Column("varchar", { name: "resMemberStoreAddr", length: 255 })
  resMemberStoreAddr: string;

  @Column("varchar", { name: "resCancelYN", length: 255 })
  resCancelYn: string;

  @Column("varchar", { name: "resCancelDate", length: 255 })
  resCancelDate: string;

  @Column("varchar", { name: "resCancelAmount", length: 255 })
  resCancelAmount: string;

  @Column("varchar", { name: "resKRWAmt", length: 255 })
  resKrwAmt: string;

  @Column("varchar", { name: "resFee", length: 255 })
  resFee: string;

  @Column("varchar", { name: "resVAT", length: 255 })
  resVat: string;

  @Column("varchar", { name: "resPurchaseYN", length: 255 })
  resPurchaseYn: string;

  @Column("varchar", { name: "resPurchaseDate", length: 255 })
  resPurchaseDate: string;

  @Column("varchar", { name: "resUseNation", length: 255 })
  resUseNation: string;

  @Column("varchar", { name: "resForeignReceiptAmt", length: 255 })
  resForeignReceiptAmt: string;

  @Column("varchar", { name: "resAccountCurrency1", length: 255 })
  resAccountCurrency1: string;

  @Column("varchar", { name: "resExchangeRate", length: 255 })
  resExchangeRate: string;

  @Column("varchar", { name: "resCashBack", length: 255 })
  resCashBack: string;

  @Column("int", { name: "billing_history_id", nullable: true })
  billingHistoryId: number | null;

  @Column("varchar", { name: "resAccountOut", length: 255 })
  resAccountOut: string;

  @Column("varchar", { name: "resAccountIn", length: 255 })
  resAccountIn: string;

  @Column("varchar", { name: "resAccountDesc1", length: 255 })
  resAccountDesc1: string;

  @Column("varchar", { name: "resAccountDesc2", length: 255 })
  resAccountDesc2: string;

  @Column("varchar", { name: "resAccountDesc3", length: 255 })
  resAccountDesc3: string;

  @Column("varchar", { name: "resAccountDesc4", length: 255 })
  resAccountDesc4: string;

  @Column("varchar", { name: "resAfterTranBalance", length: 255 })
  resAfterTranBalance: string;

  @Column("varchar", {
    name: "computedAccountDesc",
    nullable: true,
    length: 255,
  })
  computedAccountDesc: string | null;

  @OneToMany(
    () => BillingHistories,
    (billingHistories) => billingHistories.codefBillingHistory
  )
  billingHistories: BillingHistories[];

  @ManyToOne(
    () => CodefBankAccountParsers,
    (codefBankAccountParsers) => codefBankAccountParsers.codefBillingHistories,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "codef_bank_account_parser_id", referencedColumnName: "id" },
  ])
  codefBankAccountParser: CodefBankAccountParsers;

  @ManyToOne(
    () => CodefBankAccounts,
    (codefBankAccounts) => codefBankAccounts.codefBillingHistories,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "codef_bank_account_id", referencedColumnName: "id" }])
  codefBankAccount: CodefBankAccounts;

  @ManyToOne(
    () => CodefCardParsers,
    (codefCardParsers) => codefCardParsers.codefBillingHistories,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "codef_card_parser_id", referencedColumnName: "id" }])
  codefCardParser: CodefCardParsers;

  @ManyToOne(
    () => CodefCards,
    (codefCards) => codefCards.codefBillingHistories,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "codef_card_id", referencedColumnName: "id" }])
  codefCard: CodefCards;

  @RelationId(
    (codefBillingHistories: CodefBillingHistories) =>
      codefBillingHistories.codefBankAccountParser
  )
  codefBankAccountParserId: number | null;

  @RelationId(
    (codefBillingHistories: CodefBillingHistories) =>
      codefBillingHistories.codefBankAccount
  )
  codefBankAccountId: number | null;

  @RelationId(
    (codefBillingHistories: CodefBillingHistories) =>
      codefBillingHistories.codefCardParser
  )
  codefCardParserId: number | null;

  @RelationId(
    (codefBillingHistories: CodefBillingHistories) =>
      codefBillingHistories.codefCard
  )
  codefCardId: number | null;
}
