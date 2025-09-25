import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { ReviewCampaignSubscriptions } from "./ReviewCampaignSubscriptions";
import { ReviewResponses } from "./ReviewResponses";

@Entity("review_response_subscription")
export class ReviewResponseSubscription extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "subscription_id", nullable: true })
  subscriptionId: number | null;

  @Column("tinyint", { name: "isUsedBefore", default: () => "'0'" })
  isUsedBefore: number;

  @Column("enum", {
    name: "usingStatus",
    nullable: true,
    enum: ["IN_USE", "NO_USE", "DONT_KNOW"],
  })
  usingStatus: "IN_USE" | "NO_USE" | "DONT_KNOW" | null;

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
    () => ReviewCampaignSubscriptions,
    (reviewCampaignSubscriptions) =>
      reviewCampaignSubscriptions.reviewResponseSubscriptions,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([
    { name: "campaign_subscription_id", referencedColumnName: "id" },
  ])
  campaignSubscription: ReviewCampaignSubscriptions;

  @ManyToOne(
    () => ReviewResponses,
    (reviewResponses) => reviewResponses.reviewResponseSubscriptions,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "response_id", referencedColumnName: "id" }])
  response: ReviewResponses;

  @RelationId(
    (reviewResponseSubscription: ReviewResponseSubscription) =>
      reviewResponseSubscription.campaignSubscription,
  )
  campaignSubscriptionId: number;

  @RelationId(
    (reviewResponseSubscription: ReviewResponseSubscription) =>
      reviewResponseSubscription.response,
  )
  responseId: number;
}
