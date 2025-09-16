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
import { Workspaces } from "./Workspaces";
import { Accounts } from "./Accounts";

@Index("IDX_415cfd641612bcfeb16459b5cc", ["workspaceId", "accountId"], {
  unique: true,
})
@Entity("workspace_roles")
export class WorkspaceRoles extends BaseEntity {
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

  @Column("int", { name: "workspace_id" })
  workspaceId: number;

  @Column("int", { name: "account_id" })
  accountId: number;

  @Column("enum", {
    name: "role",
    enum: ["OWNER", "ADMIN", "MEMBER", "INVITED"],
    default: () => "'OWNER'",
  })
  role: "OWNER" | "ADMIN" | "MEMBER" | "INVITED";

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.workspaceRoles, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "workspace_id", referencedColumnName: "id" }])
  workspace: Workspaces;

  @ManyToOne(() => Accounts, (accounts) => accounts.workspaceRoles, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "account_id", referencedColumnName: "id" }])
  account: Accounts;

  @RelationId((workspaceRoles: WorkspaceRoles) => workspaceRoles.workspace)
  workspaceId2: number;

  @RelationId((workspaceRoles: WorkspaceRoles) => workspaceRoles.account)
  accountId2: number;
}
