import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReviewCampaigns } from "./ReviewCampaigns";
import { Subscriptions } from "./Subscriptions";
import { ReviewResponseSubscription } from "./ReviewResponseSubscription";

@Entity("review_campaign_subscriptions")
export class ReviewCampaignSubscriptions {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "subscriptionName", length: 255 })
  subscriptionName: string;

  @Column("int", { name: "product_id" })
  productId: number;

  @Column("varchar", { name: "productName", length: 255 })
  productName: string;

  @Column("text", { name: "productImage" })
  productImage: string;

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
    () => ReviewCampaigns,
    (reviewCampaigns) => reviewCampaigns.reviewCampaignSubscriptions,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "campaign_id", referencedColumnName: "id" }])
  campaign: ReviewCampaigns;

  @ManyToOne(
    () => Subscriptions,
    (subscriptions) => subscriptions.reviewCampaignSubscriptions,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "subscription_id", referencedColumnName: "id" }])
  subscription: Subscriptions;

  @OneToMany(
    () => ReviewResponseSubscription,
    (reviewResponseSubscription) =>
      reviewResponseSubscription.campaignSubscription
  )
  reviewResponseSubscriptions: ReviewResponseSubscription[];
}
