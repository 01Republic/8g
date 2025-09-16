import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("FK_40ffd77e803ae336ac786ea72c6", ["invoiceAccountId"], {})
@Index("IDX_4964827b13dea442563a9e6ea6", ["teamId", "invoiceAccountId"], {
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
}
