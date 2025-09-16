import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TeamMembers } from "./TeamMembers";
import { IntegrationWorkspaces } from "./IntegrationWorkspaces";
import { IntegrationGoogleWorkspaceOauthTokenActivities } from "./IntegrationGoogleWorkspaceOauthTokenActivities";

@Index(
  "IDX_google_workspace_id_uniq_in_workspace",
  ["integrationWorkspaceId", "googleWorkspaceId"],
  { unique: true }
)
@Entity("integration_google_workspace_members")
export class IntegrationGoogleWorkspaceMembers extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "integration_workspace_id" })
  integrationWorkspaceId: number;

  @Column("text", { name: "response" })
  response: string;

  @Column("varchar", { name: "googleWorkspaceId", length: 255 })
  googleWorkspaceId: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "realName", nullable: true, length: 255 })
  realName: string | null;

  @Column("varchar", { name: "displayName", nullable: true, length: 255 })
  displayName: string | null;

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

  @Column("int", { name: "subscriptionCount", default: () => "'0'" })
  subscriptionCount: number;

  @ManyToOne(
    () => TeamMembers,
    (teamMembers) => teamMembers.integrationGoogleWorkspaceMembers,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "team_member_id", referencedColumnName: "id" }])
  teamMember: TeamMembers;

  @ManyToOne(
    () => IntegrationWorkspaces,
    (integrationWorkspaces) =>
      integrationWorkspaces.integrationGoogleWorkspaceMembers,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "integration_workspace_id", referencedColumnName: "id" },
  ])
  integrationWorkspace: IntegrationWorkspaces;

  @OneToMany(
    () => IntegrationGoogleWorkspaceOauthTokenActivities,
    (integrationGoogleWorkspaceOauthTokenActivities) =>
      integrationGoogleWorkspaceOauthTokenActivities.workspaceMember
  )
  integrationGoogleWorkspaceOauthTokenActivities: IntegrationGoogleWorkspaceOauthTokenActivities[];
}
