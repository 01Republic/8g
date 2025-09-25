import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { TeamCreditCards } from "./TeamCreditCards";
import { TeamInvoiceAccounts } from "./TeamInvoiceAccounts";
import { TeamMembers } from "./TeamMembers";
import { Tags } from "./Tags";
import { Organizations } from "./Organizations";

@Entity("teams")
export class Teams extends BaseEntity {
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

  @Column("int", { name: "subscription_count", default: () => "'0'" })
  subscriptionCount: number;

  @Column("int", { name: "teamMemberCount", default: () => "'0'" })
  teamMemberCount: number;

  @Column("int", { name: "creditCardCount", default: () => "'0'" })
  creditCardCount: number;

  @Column("int", { name: "invoiceAccountCount", default: () => "'0'" })
  invoiceAccountCount: number;

  @OneToMany(() => TeamCreditCards, (teamCreditCards) => teamCreditCards.team)
  teamCreditCards: TeamCreditCards[];

  @OneToMany(
    () => TeamInvoiceAccounts,
    (teamInvoiceAccounts) => teamInvoiceAccounts.team,
  )
  teamInvoiceAccounts: TeamInvoiceAccounts[];

  @ManyToMany(() => TeamMembers, (teamMembers) => teamMembers.teams)
  teamMembers: TeamMembers[];

  @ManyToMany(() => Tags, (tags) => tags.teams)
  @JoinTable({
    name: "team_tags",
    joinColumns: [{ name: "team_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "tag_id", referencedColumnName: "id" }],
    schema: "payplo_staging",
  })
  tags: Tags[];

  @ManyToOne(() => Organizations, (organizations) => organizations.teams, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @RelationId((teams: Teams) => teams.organization)
  organizationId: number;
}
