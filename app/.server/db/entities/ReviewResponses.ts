import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { ReviewResponseSubscription } from "./ReviewResponseSubscription";
import { ReviewCampaigns } from "./ReviewCampaigns";
import { TeamMembers } from "./TeamMembers";
import { Organizations } from "./Organizations";

@Entity("review_responses")
export class ReviewResponses extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("datetime", { name: "lastSentAt", nullable: true })
  lastSentAt: Date | null;

  @Column("datetime", { name: "submittedAt", nullable: true })
  submittedAt: Date | null;

  @Column("varchar", { name: "respondentName", nullable: true, length: 255 })
  respondentName: string | null;

  @Column("varchar", { name: "respondentEmail", nullable: true, length: 255 })
  respondentEmail: string | null;

  @Column("int", { name: "respondentTeamId", nullable: true })
  respondentTeamId: number | null;

  @Column("varchar", {
    name: "otherSubscriptionComment",
    nullable: true,
    length: 255,
  })
  otherSubscriptionComment: string | null;

  @Column("varchar", { name: "inquiry", nullable: true, length: 255 })
  inquiry: string | null;

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

  @OneToMany(
    () => ReviewResponseSubscription,
    (reviewResponseSubscription) => reviewResponseSubscription.response
  )
  reviewResponseSubscriptions: ReviewResponseSubscription[];

  @ManyToOne(
    () => ReviewCampaigns,
    (reviewCampaigns) => reviewCampaigns.reviewResponses,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "campaign_id", referencedColumnName: "id" }])
  campaign: ReviewCampaigns;

  @ManyToOne(() => TeamMembers, (teamMembers) => teamMembers.reviewResponses, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "team_member_id", referencedColumnName: "id" }])
  teamMember: TeamMembers;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.reviewResponses,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @RelationId((reviewResponses: ReviewResponses) => reviewResponses.campaign)
  campaignId: number;

  @RelationId((reviewResponses: ReviewResponses) => reviewResponses.teamMember)
  teamMemberId: number | null;

  @RelationId(
    (reviewResponses: ReviewResponses) => reviewResponses.organization
  )
  organizationId: number;
}
