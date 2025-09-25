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
import { TeamMembers } from "./TeamMembers";
import { Organizations } from "./Organizations";
import { BillingHistories } from "./BillingHistories";
import { CodefBankAccounts } from "./CodefBankAccounts";
import { CreditCard } from "./CreditCard";
import { Subscriptions } from "./Subscriptions";

@Entity("bank_accounts")
export class BankAccounts extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("tinyint", { name: "isPersonal", default: () => "'0'" })
  isPersonal: number;

  @Column("varchar", { name: "bank", nullable: true, length: 255 })
  bank: string | null;

  @Column("enum", {
    name: "kind",
    enum: ["DEPOSIT_TRUST", "FOREIGN_CURRENCY", "FUND", "LOAN"],
    default: () => "'DEPOSIT_TRUST'",
  })
  kind: "DEPOSIT_TRUST" | "FOREIGN_CURRENCY" | "FUND" | "LOAN";

  @Column("varchar", { name: "depositCode", nullable: true, length: 255 })
  depositCode: string | null;

  @Column("varchar", { name: "number", length: 255 })
  number: string;

  @Column("varchar", { name: "displayNumber", nullable: true, length: 255 })
  displayNumber: string | null;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "alias", nullable: true, length: 255 })
  alias: string | null;

  @Column("varchar", {
    name: "currencyCode",
    length: 255,
    default: () => "'KRW'",
  })
  currencyCode: string;

  @Column("int", {
    name: "usingStatus",
    comment: "사용상태 (0: UnDef, 1: NoUse, 2: InUse, 3: Expired) - sortable",
    default: () => "'0'",
  })
  usingStatus: number;

  @Column("date", { name: "startDate", nullable: true })
  startDate: string | null;

  @Column("date", { name: "endDate", nullable: true })
  endDate: string | null;

  @Column("date", { name: "lastTransDate", nullable: true })
  lastTransDate: string | null;

  @Column("tinyint", { name: "isOverDraft", default: () => "'0'" })
  isOverDraft: number;

  @Column("text", { name: "memo", nullable: true })
  memo: string | null;

  @Column("varchar", { name: "loanKind", nullable: true, length: 255 })
  loanKind: string | null;

  @Column("varchar", { name: "loanBalance", nullable: true, length: 255 })
  loanBalance: string | null;

  @Column("date", { name: "loanStartDate", nullable: true })
  loanStartDate: string | null;

  @Column("date", { name: "loanEndDate", nullable: true })
  loanEndDate: string | null;

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

  @Column("int", { name: "monthlyPaidAmount", default: () => "'0'" })
  monthlyPaidAmount: number;

  @Column("int", { name: "subscriptionCount", default: () => "'0'" })
  subscriptionCount: number;

  @ManyToOne(() => TeamMembers, (teamMembers) => teamMembers.bankAccounts, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "holding_member_id", referencedColumnName: "id" }])
  holdingMember: TeamMembers;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.bankAccounts,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @OneToMany(
    () => BillingHistories,
    (billingHistories) => billingHistories.bankAccount,
  )
  billingHistories: BillingHistories[];

  @OneToMany(
    () => CodefBankAccounts,
    (codefBankAccounts) => codefBankAccounts.bankAccount,
  )
  codefBankAccounts: CodefBankAccounts[];

  @OneToMany(() => CreditCard, (creditCard) => creditCard.bankAccount)
  creditCards: CreditCard[];

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.bankAccount)
  subscriptions: Subscriptions[];

  @RelationId((bankAccounts: BankAccounts) => bankAccounts.holdingMember)
  holdingMemberId: number | null;

  @RelationId((bankAccounts: BankAccounts) => bankAccounts.organization)
  organizationId: number;
}
