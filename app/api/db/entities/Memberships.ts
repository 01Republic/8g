import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { NotificationMessages } from "./NotificationMessages";
import { ReviewCampaigns } from "./ReviewCampaigns";
import { Roles } from "./Roles";
import { TeamMembers } from "./TeamMembers";

@Index("IDX_7c1e2fdfed4f6838e0c05ae505", ["userId"], {})
@Index("IDX_e5380c394ec7912046d07b5429", ["organizationId"], {})
@Index("IDX_organization_id_user_id", ["organizationId", "userId"], {
  unique: true,
})
@Entity("memberships")
export class Memberships {
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

  @Column("int", { name: "organization_id" })
  organizationId: number;

  @Column("int", { name: "user_id", nullable: true })
  userId: number | null;

  @Column("enum", {
    name: "level",
    enum: ["MEMBER", "OWNER", "ADMIN"],
    default: () => "'MEMBER'",
  })
  level: "MEMBER" | "OWNER" | "ADMIN";

  @Column("enum", {
    name: "approvalStatus",
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: () => "'PENDING'",
  })
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";

  @Column("enum", {
    name: "displayCurrency",
    enum: ["USD", "KRW"],
    default: () => "'KRW'",
  })
  displayCurrency: "USD" | "KRW";

  @Column("varchar", { name: "invited_email", nullable: true, length: 255 })
  invitedEmail: string | null;

  @Column("datetime", { name: "invite_sent_at", nullable: true })
  inviteSentAt: Date | null;

  @Column("datetime", { name: "invite_confirmed_at", nullable: true })
  inviteConfirmedAt: Date | null;

  @Column("datetime", {
    name: "last_signed_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  lastSignedAt: Date;

  @OneToMany(
    () => NotificationMessages,
    (notificationMessages) => notificationMessages.membership
  )
  notificationMessages: NotificationMessages[];

  @OneToMany(() => ReviewCampaigns, (reviewCampaigns) => reviewCampaigns.author)
  reviewCampaigns: ReviewCampaigns[];

  @OneToMany(() => Roles, (roles) => roles.membership)
  roles: Roles[];

  @OneToOne(() => TeamMembers, (teamMembers) => teamMembers.membership)
  teamMembers: TeamMembers;
}
