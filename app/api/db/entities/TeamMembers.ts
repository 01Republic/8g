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
import { BankAccounts } from "./BankAccounts";
import { CreditCard } from "./CreditCard";
import { IntegrationGoogleWorkspaceMembers } from "./IntegrationGoogleWorkspaceMembers";
import { IntegrationSlackMembers } from "./IntegrationSlackMembers";
import { InvoiceAccounts } from "./InvoiceAccounts";
import { ReviewResponses } from "./ReviewResponses";
import { SignedHistories } from "./SignedHistories";
import { Subscriptions } from "./Subscriptions";
import { Organizations } from "./Organizations";
import { Memberships } from "./Memberships";
import { WorkspaceMembers } from "./WorkspaceMembers";

@Index("IDX_8e731297376b885543803be556", ["membershipId"], { unique: true })
@Entity("team_members")
export class TeamMembers {
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

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("varchar", { name: "phone", nullable: true, length: 255 })
  phone: string | null;

  @Column("varchar", { name: "job_name", nullable: true, length: 255 })
  jobName: string | null;

  @Column("text", { name: "job_description", nullable: true })
  jobDescription: string | null;

  @Column("text", { name: "notes", nullable: true })
  notes: string | null;

  @Column("text", { name: "profile_img_url", nullable: true })
  profileImgUrl: string | null;

  @Column("int", { name: "membership_id", nullable: true, unique: true })
  membershipId: number | null;

  @Column("int", { name: "subscription_count", default: () => "'0'" })
  subscriptionCount: number;

  @OneToMany(() => BankAccounts, (bankAccounts) => bankAccounts.holdingMember)
  bankAccounts: BankAccounts[];

  @OneToMany(() => CreditCard, (creditCard) => creditCard.holdingMember)
  creditCards: CreditCard[];

  @OneToMany(
    () => IntegrationGoogleWorkspaceMembers,
    (integrationGoogleWorkspaceMembers) =>
      integrationGoogleWorkspaceMembers.teamMember
  )
  integrationGoogleWorkspaceMembers: IntegrationGoogleWorkspaceMembers[];

  @OneToMany(
    () => IntegrationSlackMembers,
    (integrationSlackMembers) => integrationSlackMembers.teamMember
  )
  integrationSlackMembers: IntegrationSlackMembers[];

  @OneToMany(
    () => InvoiceAccounts,
    (invoiceAccounts) => invoiceAccounts.holdingMember
  )
  invoiceAccounts: InvoiceAccounts[];

  @OneToMany(
    () => ReviewResponses,
    (reviewResponses) => reviewResponses.teamMember
  )
  reviewResponses: ReviewResponses[];

  @OneToMany(
    () => SignedHistories,
    (signedHistories) => signedHistories.teamMember
  )
  signedHistories: SignedHistories[];

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.master)
  subscriptions: Subscriptions[];

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.teamMembers,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @OneToOne(() => Memberships, (memberships) => memberships.teamMembers, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "membership_id", referencedColumnName: "id" }])
  membership: Memberships;

  @OneToMany(
    () => WorkspaceMembers,
    (workspaceMembers) => workspaceMembers.teamMember
  )
  workspaceMembers: WorkspaceMembers[];
}
