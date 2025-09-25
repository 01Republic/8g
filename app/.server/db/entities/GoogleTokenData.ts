import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GoogleSyncHistories } from "./GoogleSyncHistories";
import { InvoiceAccounts } from "./InvoiceAccounts";

@Index("IDX_bbe6e4d334e398a4ef9468767d", ["uid"], {})
@Entity("google_token_data")
export class GoogleTokenData extends BaseEntity {
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

  @Column("varchar", { name: "uid", length: 255 })
  uid: string;

  @Column("text", { name: "access_token" })
  accessToken: string;

  @Column("text", { name: "refresh_token" })
  refreshToken: string;

  @Column("datetime", { name: "expire_at" })
  expireAt: Date;

  @Column("text", { name: "scope" })
  scope: string;

  @Column("text", { name: "id_token", nullable: true })
  idToken: string | null;

  @Column("text", { name: "token_type", nullable: true })
  tokenType: string | null;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "picture", nullable: true })
  picture: string | null;

  @Column("text", { name: "locale", nullable: true })
  locale: string | null;

  @OneToMany(
    () => GoogleSyncHistories,
    (googleSyncHistories) => googleSyncHistories.googleTokenData,
  )
  googleSyncHistories: GoogleSyncHistories[];

  @OneToMany(
    () => InvoiceAccounts,
    (invoiceAccounts) => invoiceAccounts.googleTokenData,
  )
  invoiceAccounts: InvoiceAccounts[];
}
