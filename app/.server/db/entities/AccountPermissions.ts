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
import { Accounts } from "./Accounts";
import { TeamMembers } from "./TeamMembers";

@Index("IDX_3b6aaf83f13b115743207662ad", ["accountId", "teamMemberId"], {})
@Entity("account_permissions")
export class AccountPermissions extends BaseEntity {
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

  @Column("int", { name: "account_id" })
  accountId: number;

  @Column("int", { name: "team_member_id" })
  teamMemberId: number;

  @Column("enum", {
    name: "permission",
    enum: ["READ", "WRITE", "READ_WRITE"],
    default: () => "'READ_WRITE'",
  })
  permission: "READ" | "WRITE" | "READ_WRITE";

  @Column("enum", {
    name: "role",
    enum: ["MEMBER", "CREATOR", "OWNER", "ADMIN"],
    default: () => "'CREATOR'",
  })
  role: "MEMBER" | "CREATOR" | "OWNER" | "ADMIN";

  @ManyToOne(() => Accounts, (accounts) => accounts.accountPermissions, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "account_id", referencedColumnName: "id" }])
  account: Accounts;

  @ManyToOne(
    () => TeamMembers,
    (teamMembers) => teamMembers.accountPermissions,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "team_member_id", referencedColumnName: "id" }])
  teamMember: TeamMembers;

  @RelationId(
    (accountPermissions: AccountPermissions) => accountPermissions.account
  )
  accountId2: number;

  @RelationId(
    (accountPermissions: AccountPermissions) => accountPermissions.teamMember
  )
  teamMemberId2: number;
}
