import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GmailItems } from "./GmailItems";
import { Organizations } from "./Organizations";
import { GoogleTokenData } from "./GoogleTokenData";
import { TeamMembers } from "./TeamMembers";
import { InvoiceApps } from "./InvoiceApps";

@Entity("invoice_accounts")
export class InvoiceAccounts {
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

  @Column("text", { name: "image", nullable: true })
  image: string | null;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("text", { name: "tokenData" })
  tokenData: string;

  @Column("tinyint", { name: "isActive", default: () => "'1'" })
  isActive: number;

  @Column("tinyint", { name: "isSyncRunning", default: () => "'0'" })
  isSyncRunning: number;

  @Column("text", { name: "memo", nullable: true })
  memo: string | null;

  @Column("date", { name: "syncedStartDate", nullable: true })
  syncedStartDate: string | null;

  @Column("date", { name: "syncedEndDate", nullable: true })
  syncedEndDate: string | null;

  @Column("int", {
    name: "usingStatus",
    comment: "사용상태 (0: UnDef, 1: NoUse, 2: InUse, 3: Expired) - sortable",
    default: () => "'0'",
  })
  usingStatus: number;

  @Column("tinyint", { name: "isInteractorConnected", default: () => "'0'" })
  isInteractorConnected: number;

  @OneToMany(() => GmailItems, (gmailItems) => gmailItems.invoiceAccount)
  gmailItems: GmailItems[];

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.invoiceAccounts,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(
    () => GoogleTokenData,
    (googleTokenData) => googleTokenData.invoiceAccounts,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "google_token_data_id", referencedColumnName: "id" }])
  googleTokenData: GoogleTokenData;

  @ManyToOne(() => TeamMembers, (teamMembers) => teamMembers.invoiceAccounts, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "holding_member_id", referencedColumnName: "id" }])
  holdingMember: TeamMembers;

  @OneToMany(() => InvoiceApps, (invoiceApps) => invoiceApps.invoiceAccount)
  invoiceApps: InvoiceApps[];
}
