import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IntegrationGoogleWorkspaceOauthTokenActivities } from "./IntegrationGoogleWorkspaceOauthTokenActivities";
import { ReviewCampaignSubscriptions } from "./ReviewCampaignSubscriptions";
import { SignedHistories } from "./SignedHistories";
import { Tags } from "./Tags";
import { BankAccounts } from "./BankAccounts";
import { Organizations } from "./Organizations";
import { Moneys } from "./Moneys";
import { CreditCard } from "./CreditCard";
import { TeamMembers } from "./TeamMembers";
import { VendorContracts } from "./VendorContracts";

@Index("FK_4e2c60f2098be741982c4e1a1c0", ["productId"], {})
@Index("FK_ca53e4525d1ce59e7a75ff5db59", ["paymentPlanId"], {})
@Index("FK_cbde2aec62d9e30a31bb167d7d4", ["workspaceId"], {})
@Index("FK_d33566532e2a80f66194452537a", ["billingCycleId"], {})
@Entity("subscriptions")
export class Subscriptions {
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

  @Column("enum", {
    name: "connectStatus",
    enum: ["APPLIED", "PENDING", "SUCCESS", "FAILURE"],
    default: () => "'APPLIED'",
  })
  connectStatus: "APPLIED" | "PENDING" | "SUCCESS" | "FAILURE";

  @Column("int", { name: "product_id" })
  productId: number;

  @Column("tinyint", { name: "isFreeTier", default: () => "'0'" })
  isFreeTier: number;

  @Column("datetime", { name: "registered_at", nullable: true })
  registeredAt: Date | null;

  @Column("int", { name: "account_count", default: () => "'0'" })
  accountCount: number;

  @Column("int", { name: "payment_plan_id", nullable: true })
  paymentPlanId: number | null;

  @Column("int", { name: "billing_cycle_id", nullable: true })
  billingCycleId: number | null;

  @Column("int", { name: "paid_member_count", default: () => "'0'" })
  paidMemberCount: number;

  @Column("int", { name: "used_member_count", default: () => "'0'" })
  usedMemberCount: number;

  @Column("datetime", { name: "next_billing_date", nullable: true })
  nextBillingDate: Date | null;

  @Column("float", {
    name: "next_billing_amount",
    precision: 12,
    default: () => "'0'",
  })
  nextBillingAmount: number;

  @Column("tinyint", { name: "isSyncRunning", default: () => "'0'" })
  isSyncRunning: number;

  @Column("int", { name: "workspace_id", nullable: true })
  workspaceId: number | null;

  @Column("enum", {
    name: "assumed_billing_type",
    enum: ["MONTHLY", "YEARLY", "ONETIME", "UNDEFINED"],
    default: () => "'UNDEFINED'",
  })
  assumedBillingType: "MONTHLY" | "YEARLY" | "ONETIME" | "UNDEFINED";

  @Column("tinyint", { name: "isActive", nullable: true, default: () => "'1'" })
  isActive: number | null;

  @Column("enum", {
    name: "status",
    enum: [
      "NONE",
      "FREE_TRIAL_STARTED",
      "FREE_TRIAL_EXPIRED",
      "PAYMENT_SUCCESS",
      "PAYMENT_PENDING",
      "PAYMENT_FAILURE",
      "PAUSED",
      "CANCELED",
    ],
    default: () => "'NONE'",
  })
  status:
    | "NONE"
    | "FREE_TRIAL_STARTED"
    | "FREE_TRIAL_EXPIRED"
    | "PAYMENT_SUCCESS"
    | "PAYMENT_PENDING"
    | "PAYMENT_FAILURE"
    | "PAUSED"
    | "CANCELED";

  @Column("tinyint", { name: "is_per_user", default: () => "'0'" })
  isPerUser: number;

  @Column("tinyint", { name: "isDynamicBillingAmount", default: () => "'0'" })
  isDynamicBillingAmount: number;

  @Column("varchar", { name: "alias", length: 255 })
  alias: string;

  @Column("text", { name: "desc", nullable: true })
  desc: string | null;

  @Column("enum", {
    name: "pricing_model",
    enum: [
      "NONE",
      "PER_USAGE",
      "PER_SEAT",
      "PER_UNIT",
      "FIXED",
      "LICENSE",
      "CREDIT",
    ],
    default: () => "'NONE'",
  })
  pricingModel:
    | "NONE"
    | "PER_USAGE"
    | "PER_SEAT"
    | "PER_UNIT"
    | "FIXED"
    | "LICENSE"
    | "CREDIT";

  @Column("enum", {
    name: "billing_cycle_type",
    enum: ["None", "Monthly", "Yearly", "Onetime"],
    default: () => "'None'",
  })
  billingCycleType: "None" | "Monthly" | "Yearly" | "Onetime";

  @Column("enum", {
    name: "connect_method",
    enum: ["MANUAL", "G_SUITE", "INVOICE", "CODEF_CARD"],
    default: () => "'MANUAL'",
  })
  connectMethod: "MANUAL" | "G_SUITE" | "INVOICE" | "CODEF_CARD";

  @Column("datetime", { name: "last_paid_at", nullable: true })
  lastPaidAt: Date | null;

  @Column("varchar", {
    name: "cardHistoryGroupName",
    nullable: true,
    length: 255,
  })
  cardHistoryGroupName: string | null;

  @Column("date", { name: "startAt", nullable: true })
  startAt: string | null;

  @Column("date", { name: "finishAt", nullable: true })
  finishAt: string | null;

  @Column("datetime", { name: "next_computed_billing_date", nullable: true })
  nextComputedBillingDate: Date | null;

  @OneToMany(
    () => IntegrationGoogleWorkspaceOauthTokenActivities,
    (integrationGoogleWorkspaceOauthTokenActivities) =>
      integrationGoogleWorkspaceOauthTokenActivities.subscription
  )
  integrationGoogleWorkspaceOauthTokenActivities: IntegrationGoogleWorkspaceOauthTokenActivities[];

  @OneToMany(
    () => ReviewCampaignSubscriptions,
    (reviewCampaignSubscriptions) => reviewCampaignSubscriptions.subscription
  )
  reviewCampaignSubscriptions: ReviewCampaignSubscriptions[];

  @OneToMany(
    () => SignedHistories,
    (signedHistories) => signedHistories.subscription
  )
  signedHistories: SignedHistories[];

  @ManyToOne(() => Tags, (tags) => tags.subscriptions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "recurring_type_tag_id", referencedColumnName: "id" }])
  recurringTypeTag: Tags;

  @ManyToOne(() => BankAccounts, (bankAccounts) => bankAccounts.subscriptions, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "bank_account_id", referencedColumnName: "id" }])
  bankAccount: BankAccounts;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.subscriptions,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(() => Tags, (tags) => tags.subscriptions2, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "billing_cycle_tag_id", referencedColumnName: "id" }])
  billingCycleTag: Tags;

  @OneToOne(() => Moneys, (moneys) => moneys.subscriptions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "current_billing_amount_id", referencedColumnName: "id" },
  ])
  currentBillingAmount: Moneys;

  @ManyToOne(() => CreditCard, (creditCard) => creditCard.subscriptions, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "credit_card_id", referencedColumnName: "id" }])
  creditCard: CreditCard;

  @ManyToOne(() => TeamMembers, (teamMembers) => teamMembers.subscriptions, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "master_id", referencedColumnName: "id" }])
  master: TeamMembers;

  @OneToMany(
    () => VendorContracts,
    (vendorContracts) => vendorContracts.subscription
  )
  vendorContracts: VendorContracts[];
}
