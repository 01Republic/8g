import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Subscriptions } from "./Subscriptions";
import { ProductSimilarNames } from "./ProductSimilarNames";
import { IntegrationGoogleWorkspaceMembers } from "./IntegrationGoogleWorkspaceMembers";
import { IntegrationWorkspaces } from "./IntegrationWorkspaces";

@Entity("integration_google_workspace_oauth_token_activities")
export class IntegrationGoogleWorkspaceOauthTokenActivities extends BaseEntity {
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

  @Column("text", { name: "response" })
  response: string;

  @Column("varchar", { name: "originalAppName", length: 255 })
  originalAppName: string;

  @Column("datetime", { name: "authorizedAt", nullable: true })
  authorizedAt: Date | null;

  @ManyToOne(
    () => Subscriptions,
    (subscriptions) =>
      subscriptions.integrationGoogleWorkspaceOauthTokenActivities,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "subscription_id", referencedColumnName: "id" }])
  subscription: Subscriptions;

  @ManyToOne(
    () => ProductSimilarNames,
    (productSimilarNames) =>
      productSimilarNames.integrationGoogleWorkspaceOauthTokenActivities,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "product_similar_name_id", referencedColumnName: "id" }])
  productSimilarName: ProductSimilarNames;

  @ManyToOne(
    () => IntegrationGoogleWorkspaceMembers,
    (integrationGoogleWorkspaceMembers) =>
      integrationGoogleWorkspaceMembers.integrationGoogleWorkspaceOauthTokenActivities,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "workspace_member_id", referencedColumnName: "id" }])
  workspaceMember: IntegrationGoogleWorkspaceMembers;

  @ManyToOne(
    () => IntegrationWorkspaces,
    (integrationWorkspaces) =>
      integrationWorkspaces.integrationGoogleWorkspaceOauthTokenActivities,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([
    { name: "integration_workspace_id", referencedColumnName: "id" },
  ])
  integrationWorkspace: IntegrationWorkspaces;

  @RelationId(
    (
      integrationGoogleWorkspaceOauthTokenActivities: IntegrationGoogleWorkspaceOauthTokenActivities,
    ) => integrationGoogleWorkspaceOauthTokenActivities.subscription,
  )
  subscriptionId: number | null;

  @RelationId(
    (
      integrationGoogleWorkspaceOauthTokenActivities: IntegrationGoogleWorkspaceOauthTokenActivities,
    ) => integrationGoogleWorkspaceOauthTokenActivities.productSimilarName,
  )
  productSimilarNameId: number;

  @RelationId(
    (
      integrationGoogleWorkspaceOauthTokenActivities: IntegrationGoogleWorkspaceOauthTokenActivities,
    ) => integrationGoogleWorkspaceOauthTokenActivities.workspaceMember,
  )
  workspaceMemberId: number;

  @RelationId(
    (
      integrationGoogleWorkspaceOauthTokenActivities: IntegrationGoogleWorkspaceOauthTokenActivities,
    ) => integrationGoogleWorkspaceOauthTokenActivities.integrationWorkspace,
  )
  integrationWorkspaceId: number;
}
