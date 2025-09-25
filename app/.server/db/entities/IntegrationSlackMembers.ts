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
import { IntegrationWorkspaces } from "./IntegrationWorkspaces";
import { TeamMembers } from "./TeamMembers";

@Index(
  "IDX_slack_id_uniq_in_workspace",
  ["integrationWorkspaceId", "slackId"],
  { unique: true },
)
@Entity("integration_slack_members")
export class IntegrationSlackMembers extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "integration_workspace_id" })
  integrationWorkspaceId: number;

  @Column("text", { name: "response" })
  response: string;

  @Column("varchar", { name: "slackId", length: 255 })
  slackId: string;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("varchar", { name: "phone", nullable: true, length: 255 })
  phone: string | null;

  @Column("text", { name: "imageUrl", nullable: true })
  imageUrl: string | null;

  @Column("tinyint", { name: "isDeleted" })
  isDeleted: number;

  @Column("tinyint", { name: "isAdmin" })
  isAdmin: number;

  @Column("tinyint", { name: "isOwner" })
  isOwner: number;

  @Column("tinyint", { name: "isPrimaryOwner" })
  isPrimaryOwner: number;

  @Column("tinyint", { name: "isRestricted" })
  isRestricted: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "realName", nullable: true, length: 255 })
  realName: string | null;

  @Column("varchar", { name: "displayName", nullable: true, length: 255 })
  displayName: string | null;

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

  @ManyToOne(
    () => IntegrationWorkspaces,
    (integrationWorkspaces) => integrationWorkspaces.integrationSlackMembers,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([
    { name: "integration_workspace_id", referencedColumnName: "id" },
  ])
  integrationWorkspace: IntegrationWorkspaces;

  @ManyToOne(
    () => TeamMembers,
    (teamMembers) => teamMembers.integrationSlackMembers,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "team_member_id", referencedColumnName: "id" }])
  teamMember: TeamMembers;

  @RelationId(
    (integrationSlackMembers: IntegrationSlackMembers) =>
      integrationSlackMembers.integrationWorkspace,
  )
  integrationWorkspaceId2: number;

  @RelationId(
    (integrationSlackMembers: IntegrationSlackMembers) =>
      integrationSlackMembers.teamMember,
  )
  teamMemberId: number | null;
}
