import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { WorkspaceMembers } from "./WorkspaceMembers";
import { Accounts } from "./Accounts";
import { Organizations } from "./Organizations";

@Index("FK_80ed15ab825eceaf60ae94c4821", ["productId"], {})
@Index("IDX_b8e9fe62e93d60089dfc4f175f", ["slug"], {})
@Entity("workspaces")
export class Workspaces {
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

  @OneToMany(
    () => WorkspaceMembers,
    (workspaceMembers) => workspaceMembers.workspace
  )
  workspaceMembers: WorkspaceMembers[];

  @ManyToOne(() => Accounts, (accounts) => accounts.workspaces, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "sync_account_id", referencedColumnName: "id" }])
  syncAccount: Accounts;

  @ManyToOne(() => Organizations, (organizations) => organizations.workspaces, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;
}
