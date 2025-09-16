import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IntegrationGoogleWorkspaceMembers } from "./IntegrationGoogleWorkspaceMembers";
import { IntegrationGoogleWorkspaceOauthTokenActivities } from "./IntegrationGoogleWorkspaceOauthTokenActivities";
import { IntegrationSlackMembers } from "./IntegrationSlackMembers";
import { IntegrationSlackOauthTokenActivities } from "./IntegrationSlackOauthTokenActivities";
import { Organizations } from "./Organizations";

@Index("IDX_5934b3c32a2a544227f2a89312", ["provider"], {})
@Index("IDX_integration_provider_uid", ["organizationId", "provider", "uid"], {
  unique: true,
})
@Entity("integration_workspaces")
export class IntegrationWorkspaces {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "organization_id" })
  organizationId: number;

  @Column("varchar", { name: "provider", length: 255 })
  provider: string;

  @Column("varchar", { name: "uid", length: 255 })
  uid: string;

  @Column("text", { name: "authorizedResponse" })
  authorizedResponse: string;

  @Column("text", { name: "content" })
  content: string;

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

  @Column("int", {
    name: "subscriptionCount",
    nullable: true,
    default: () => "'0'",
  })
  subscriptionCount: number | null;

  @OneToMany(
    () => IntegrationGoogleWorkspaceMembers,
    (integrationGoogleWorkspaceMembers) =>
      integrationGoogleWorkspaceMembers.integrationWorkspace
  )
  integrationGoogleWorkspaceMembers: IntegrationGoogleWorkspaceMembers[];

  @OneToMany(
    () => IntegrationGoogleWorkspaceOauthTokenActivities,
    (integrationGoogleWorkspaceOauthTokenActivities) =>
      integrationGoogleWorkspaceOauthTokenActivities.integrationWorkspace
  )
  integrationGoogleWorkspaceOauthTokenActivities: IntegrationGoogleWorkspaceOauthTokenActivities[];

  @OneToMany(
    () => IntegrationSlackMembers,
    (integrationSlackMembers) => integrationSlackMembers.integrationWorkspace
  )
  integrationSlackMembers: IntegrationSlackMembers[];

  @OneToMany(
    () => IntegrationSlackOauthTokenActivities,
    (integrationSlackOauthTokenActivities) =>
      integrationSlackOauthTokenActivities.integrationWorkspace
  )
  integrationSlackOauthTokenActivities: IntegrationSlackOauthTokenActivities[];

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.integrationWorkspaces,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;
}
