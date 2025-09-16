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
import { Subscriptions } from "./Subscriptions";
import { WorkspaceMembers } from "./WorkspaceMembers";
import { WorkspaceRoles } from "./WorkspaceRoles";
import { Accounts } from "./Accounts";
import { Products } from "./Products";
import { Organizations } from "./Organizations";

@Index("FK_80ed15ab825eceaf60ae94c4821", ["productId"], {})
@Index("IDX_b8e9fe62e93d60089dfc4f175f", ["slug"], {})
@Entity("workspaces")
export class Workspaces extends BaseEntity {
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

  @Column("varchar", { name: "display_name", length: 255 })
  displayName: string;

  @Column("varchar", { name: "slug", length: 255 })
  slug: string;

  @Column("int", { name: "product_id" })
  productId: number;

  @Column("text", { name: "profile_image_url", nullable: true })
  profileImageUrl: string | null;

  @Column("text", { name: "billing_page_url", nullable: true })
  billingPageUrl: string | null;

  @Column("text", { name: "members_page_url", nullable: true })
  membersPageUrl: string | null;

  @Column("text", { name: "org_page_url", nullable: true })
  orgPageUrl: string | null;

  @Column("varchar", { name: "public_email", nullable: true, length: 255 })
  publicEmail: string | null;

  @Column("varchar", { name: "billing_email", nullable: true, length: 255 })
  billingEmail: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.workspace)
  subscriptions: Subscriptions[];

  @OneToMany(
    () => WorkspaceMembers,
    (workspaceMembers) => workspaceMembers.workspace
  )
  workspaceMembers: WorkspaceMembers[];

  @OneToMany(() => WorkspaceRoles, (workspaceRoles) => workspaceRoles.workspace)
  workspaceRoles: WorkspaceRoles[];

  @ManyToOne(() => Accounts, (accounts) => accounts.workspaces, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "sync_account_id", referencedColumnName: "id" }])
  syncAccount: Accounts;

  @ManyToOne(() => Products, (products) => products.workspaces, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @ManyToOne(() => Organizations, (organizations) => organizations.workspaces, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @RelationId((workspaces: Workspaces) => workspaces.syncAccount)
  syncAccountId: number | null;

  @RelationId((workspaces: Workspaces) => workspaces.product)
  productId2: number;

  @RelationId((workspaces: Workspaces) => workspaces.organization)
  organizationId: number;
}
