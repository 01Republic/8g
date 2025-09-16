import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BillingHistories } from "./BillingHistories";
import { TeamMembers } from "./TeamMembers";
import { Organizations } from "./Organizations";
import { BankAccounts } from "./BankAccounts";
import { Subscriptions } from "./Subscriptions";

@Entity("credit_card")
export class CreditCard {
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

  @Column("varchar", { name: "number_1", nullable: true, length: 255 })
  number_1: string | null;

  @Column("varchar", { name: "number_2", nullable: true, length: 255 })
  number_2: string | null;

  @Column("varchar", { name: "number_3", nullable: true, length: 255 })
  number_3: string | null;

  @Column("varchar", { name: "number_4", nullable: true, length: 255 })
  number_4: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 255 })
  password: string | null;

  @Column("varchar", { name: "cvc", nullable: true, length: 255 })
  cvc: string | null;

  @Column("char", { name: "expiry", nullable: true, length: 4 })
  expiry: string | null;

  @Column("varchar", { name: "issuer_company", nullable: true, length: 255 })
  issuerCompany: string | null;

  @Column("varchar", { name: "network_company", nullable: true, length: 255 })
  networkCompany: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("text", { name: "memo", nullable: true })
  memo: string | null;

  @Column("tinyint", { name: "is_personal", default: () => "'0'" })
  isPersonal: number;

  @Column("int", { name: "expireYear", nullable: true })
  expireYear: number | null;

  @Column("int", { name: "expireMonth", nullable: true })
  expireMonth: number | null;

  @Column("int", {
    name: "usingStatus",
    comment: "사용상태 (0: UnDef, 1: NoUse, 2: InUse, 3: Expired) - sortable",
    default: () => "'0'",
  })
  usingStatus: number;

  @Column("tinyint", { name: "isCreditCard", default: () => "'1'" })
  isCreditCard: number;

  @Column("int", { name: "monthlyPaidAmount", default: () => "'0'" })
  monthlyPaidAmount: number;

  @Column("int", { name: "subscriptionCount", default: () => "'0'" })
  subscriptionCount: number;

  @OneToMany(
    () => BillingHistories,
    (billingHistories) => billingHistories.creditCard
  )
  billingHistories: BillingHistories[];

  @ManyToOne(() => TeamMembers, (teamMembers) => teamMembers.creditCards, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "holding_member_id", referencedColumnName: "id" }])
  holdingMember: TeamMembers;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.creditCards,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(() => BankAccounts, (bankAccounts) => bankAccounts.creditCards, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "bank_account_id", referencedColumnName: "id" }])
  bankAccount: BankAccounts;

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.creditCard)
  subscriptions: Subscriptions[];
}
