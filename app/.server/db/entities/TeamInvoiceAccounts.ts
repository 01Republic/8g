import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Teams } from "./Teams";
import { InvoiceAccounts } from "./InvoiceAccounts";

@Index("IDX_4964827b13dea442563a9e6ea6", ["invoiceAccountId", "teamId"], {
  unique: true,
})
@Entity("team_invoice_accounts")
export class TeamInvoiceAccounts extends BaseEntity {
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

  @Column("int", { name: "team_id" })
  teamId: number;

  @ManyToOne(() => Teams, (teams) => teams.teamInvoiceAccounts, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "team_id", referencedColumnName: "id" }])
  team: Teams;

  @ManyToOne(
    () => InvoiceAccounts,
    (invoiceAccounts) => invoiceAccounts.teamInvoiceAccounts,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "invoice_account_id", referencedColumnName: "id" }])
  invoiceAccount: InvoiceAccounts;

  @RelationId(
    (teamInvoiceAccounts: TeamInvoiceAccounts) => teamInvoiceAccounts.team
  )
  teamId2: number;

  @RelationId(
    (teamInvoiceAccounts: TeamInvoiceAccounts) =>
      teamInvoiceAccounts.invoiceAccount
  )
  invoiceAccountId2: number;
}
