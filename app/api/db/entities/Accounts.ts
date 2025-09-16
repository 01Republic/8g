import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organizations } from "./Organizations";
import { Products } from "./Products";
import { SignedHistories } from "./SignedHistories";
import { Workspaces } from "./Workspaces";

@Index("IDX_58727fdc27b4741fff3bc8d8cd", ["productId", "organizationId"], {})
@Index("IDX_70f03445d49a83965842c19551", ["sign"], {})
@Entity("accounts")
export class Accounts {
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

  @Column("varchar", { name: "sign", length: 255 })
  sign: string;

  @Column("int", { name: "product_id" })
  productId: number;

  @Column("int", { name: "organization_id" })
  organizationId: number;

  @Column("enum", {
    name: "connect_session",
    enum: ["IN_VERIFICATION", "SUCCESS", "FAILURE"],
    default: () => "'IN_VERIFICATION'",
  })
  connectSession: "IN_VERIFICATION" | "SUCCESS" | "FAILURE";

  @Column("text", { name: "login_page_url", nullable: true })
  loginPageUrl: string | null;

  @Column("varchar", { name: "login_method", nullable: true, length: 255 })
  loginMethod: string | null;

  @Column("text", { name: "memo", nullable: true })
  memo: string | null;

  @ManyToOne(() => Organizations, (organizations) => organizations.accounts, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(() => Products, (products) => products.accounts, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @OneToMany(
    () => SignedHistories,
    (signedHistories) => signedHistories.account
  )
  signedHistories: SignedHistories[];

  @OneToMany(() => Workspaces, (workspaces) => workspaces.syncAccount)
  workspaces: Workspaces[];
}
