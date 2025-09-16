import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accounts } from "./Accounts";
import { BankAccounts } from "./BankAccounts";
import { BillingHistories } from "./BillingHistories";
import { CodefAccounts } from "./CodefAccounts";
import { CodefConnectedIdentities } from "./CodefConnectedIdentities";
import { CreditCard } from "./CreditCard";
import { GmailItems } from "./GmailItems";
import { GoogleSyncHistories } from "./GoogleSyncHistories";
import { IntegrationWorkspaces } from "./IntegrationWorkspaces";
import { InvoiceAccounts } from "./InvoiceAccounts";
import { OrganizationBizInfos } from "./OrganizationBizInfos";
import { ReviewCampaigns } from "./ReviewCampaigns";
import { ReviewResponses } from "./ReviewResponses";
import { Roles } from "./Roles";
import { ScordiPaymentMethods } from "./ScordiPaymentMethods";
import { ScordiPayments } from "./ScordiPayments";
import { ScordiSubscriptions } from "./ScordiSubscriptions";
import { Subscriptions } from "./Subscriptions";
import { Tags } from "./Tags";
import { TeamMembers } from "./TeamMembers";
import { Teams } from "./Teams";
import { VendorCompanies } from "./VendorCompanies";
import { Workspaces } from "./Workspaces";

@Index("IDX_963693341bd612aa01ddf3a4b6", ["slug"], { unique: true })
@Entity("organizations")
export class Organizations extends BaseEntity {
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

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "slug", unique: true, length: 255 })
  slug: string;

  @Column("text", { name: "image", nullable: true })
  image: string | null;

  @Column("int", { name: "memberCount", default: () => "'0'" })
  memberCount: number;

  @Column("varchar", { name: "address", nullable: true, length: 255 })
  address: string | null;

  @Column("varchar", { name: "addressDetail", nullable: true, length: 255 })
  addressDetail: string | null;

  @Column("int", { name: "subscription_count", default: () => "'0'" })
  subscriptionCount: number;

  @Column("tinyint", { name: "isDemo", default: () => "'0'" })
  isDemo: number;

  @Column("datetime", { name: "onboardingFinishedAt", nullable: true })
  onboardingFinishedAt: Date | null;

  @OneToMany(() => Accounts, (accounts) => accounts.organization)
  accounts: Accounts[];

  @OneToMany(() => BankAccounts, (bankAccounts) => bankAccounts.organization)
  bankAccounts: BankAccounts[];

  @OneToMany(
    () => BillingHistories,
    (billingHistories) => billingHistories.organization
  )
  billingHistories: BillingHistories[];

  @OneToMany(
    () => CodefAccounts,
    (codefAccounts) => codefAccounts.organization_2
  )
  codefAccounts: CodefAccounts[];

  @OneToMany(
    () => CodefConnectedIdentities,
    (codefConnectedIdentities) => codefConnectedIdentities.organization
  )
  codefConnectedIdentities: CodefConnectedIdentities[];

  @OneToMany(() => CreditCard, (creditCard) => creditCard.organization)
  creditCards: CreditCard[];

  @OneToMany(() => GmailItems, (gmailItems) => gmailItems.organization)
  gmailItems: GmailItems[];

  @OneToMany(
    () => GoogleSyncHistories,
    (googleSyncHistories) => googleSyncHistories.organization
  )
  googleSyncHistories: GoogleSyncHistories[];

  @OneToMany(
    () => IntegrationWorkspaces,
    (integrationWorkspaces) => integrationWorkspaces.organization
  )
  integrationWorkspaces: IntegrationWorkspaces[];

  @OneToMany(
    () => InvoiceAccounts,
    (invoiceAccounts) => invoiceAccounts.organization
  )
  invoiceAccounts: InvoiceAccounts[];

  @OneToMany(
    () => OrganizationBizInfos,
    (organizationBizInfos) => organizationBizInfos.organization
  )
  organizationBizInfos: OrganizationBizInfos[];

  @ManyToOne(
    () => GoogleSyncHistories,
    (googleSyncHistories) => googleSyncHistories.organizations,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "last_google_sync_history_id", referencedColumnName: "id" },
  ])
  lastGoogleSyncHistory: GoogleSyncHistories;

  @OneToMany(
    () => ReviewCampaigns,
    (reviewCampaigns) => reviewCampaigns.organization
  )
  reviewCampaigns: ReviewCampaigns[];

  @OneToMany(
    () => ReviewResponses,
    (reviewResponses) => reviewResponses.organization
  )
  reviewResponses: ReviewResponses[];

  @OneToMany(() => Roles, (roles) => roles.organization)
  roles: Roles[];

  @OneToMany(
    () => ScordiPaymentMethods,
    (scordiPaymentMethods) => scordiPaymentMethods.organization
  )
  scordiPaymentMethods: ScordiPaymentMethods[];

  @OneToMany(
    () => ScordiPayments,
    (scordiPayments) => scordiPayments.organization
  )
  scordiPayments: ScordiPayments[];

  @OneToMany(
    () => ScordiSubscriptions,
    (scordiSubscriptions) => scordiSubscriptions.organization
  )
  scordiSubscriptions: ScordiSubscriptions[];

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.organization)
  subscriptions: Subscriptions[];

  @OneToMany(() => Tags, (tags) => tags.organization)
  tags: Tags[];

  @OneToMany(() => TeamMembers, (teamMembers) => teamMembers.organization)
  teamMembers: TeamMembers[];

  @OneToMany(() => Teams, (teams) => teams.organization)
  teams: Teams[];

  @OneToMany(
    () => VendorCompanies,
    (vendorCompanies) => vendorCompanies.organization
  )
  vendorCompanies: VendorCompanies[];

  @OneToMany(() => Workspaces, (workspaces) => workspaces.organization)
  workspaces: Workspaces[];
}
