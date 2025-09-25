import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { AccountPermissions } from "./AccountPermissions";
import { Organizations } from "./Organizations";
import { Products } from "./Products";
import { SignedHistories } from "./SignedHistories";
import { WorkspaceRoles } from "./WorkspaceRoles";
import { Workspaces } from "./Workspaces";

@Index("IDX_70f03445d49a83965842c19551", ["sign"], {})
@Index("IDX_58727fdc27b4741fff3bc8d8cd", ["productId", "organizationId"], {})
@Entity("accounts")
export class Accounts extends BaseEntity {
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

  @OneToMany(
    () => AccountPermissions,
    (accountPermissions) => accountPermissions.account,
  )
  accountPermissions: AccountPermissions[];

  @ManyToOne(() => Organizations, (organizations) => organizations.accounts, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(() => Products, (products) => products.accounts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @ManyToOne(() => Products, (products) => products.accounts2, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product_2: Products;

  @OneToMany(
    () => SignedHistories,
    (signedHistories) => signedHistories.account,
  )
  signedHistories: SignedHistories[];

  @OneToMany(() => WorkspaceRoles, (workspaceRoles) => workspaceRoles.account)
  workspaceRoles: WorkspaceRoles[];

  @OneToMany(() => Workspaces, (workspaces) => workspaces.syncAccount)
  workspaces: Workspaces[];

  @RelationId((accounts: Accounts) => accounts.organization)
  organizationId2: number;

  @RelationId((accounts: Accounts) => accounts.product)
  productId2: number;

  @RelationId((accounts: Accounts) => accounts.product_2)
  productId3: number;
}
