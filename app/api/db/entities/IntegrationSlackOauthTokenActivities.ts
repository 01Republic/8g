import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IntegrationWorkspaces } from "./IntegrationWorkspaces";

@Entity("integration_slack_oauth_token_activities")
export class IntegrationSlackOauthTokenActivities {
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

  @Column("varchar", { name: "slack_team_id", length: 255 })
  slackTeamId: string;

  @Column("varchar", { name: "access_token", length: 255 })
  accessToken: string;

  @ManyToOne(
    () => IntegrationWorkspaces,
    (integrationWorkspaces) =>
      integrationWorkspaces.integrationSlackOauthTokenActivities,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "integration_workspace_id", referencedColumnName: "id" },
  ])
  integrationWorkspace: IntegrationWorkspaces;
}
