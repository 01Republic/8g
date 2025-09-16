import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ReviewCampaignSubscriptions } from "./ReviewCampaignSubscriptions";
import { Memberships } from "./Memberships";
import { Organizations } from "./Organizations";
import { ReviewResponses } from "./ReviewResponses";

@Entity("review_campaigns")
export class ReviewCampaigns extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("datetime", { name: "startAt" })
  startAt: Date;

  @Column("datetime", { name: "finishAt" })
  finishAt: Date;

  @Column("datetime", { name: "approvedAt", nullable: true })
  approvedAt: Date | null;

  @Column("datetime", { name: "closedAt", nullable: true })
  closedAt: Date | null;

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

  @Column("int", { name: "totalResponseCount", default: () => "'0'" })
  totalResponseCount: number;

  @Column("int", { name: "submittedResponseCount", default: () => "'0'" })
  submittedResponseCount: number;

  @OneToMany(
    () => ReviewCampaignSubscriptions,
    (reviewCampaignSubscriptions) => reviewCampaignSubscriptions.campaign
  )
  reviewCampaignSubscriptions: ReviewCampaignSubscriptions[];

  @ManyToOne(() => Memberships, (memberships) => memberships.reviewCampaigns, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "author_id", referencedColumnName: "id" }])
  author: Memberships;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.reviewCampaigns,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @OneToMany(
    () => ReviewResponses,
    (reviewResponses) => reviewResponses.campaign
  )
  reviewResponses: ReviewResponses[];
}
