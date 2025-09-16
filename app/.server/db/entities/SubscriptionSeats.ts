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
import { Subscriptions } from "./Subscriptions";
import { TeamMembers } from "./TeamMembers";

@Index("IDX_9aa1ce4adea7871813a37a7287", ["teamMemberId"], {})
@Index("IDX_9829e971fc359ab67f022d6c19", ["subscriptionId"], {})
@Index("IDX_c332a550c7f70f41c5636e416d", ["deletedAt"], {})
@Index("IDX_016773c1dbb0492bda7f2df9b1", ["status"], {})
@Entity("subscription_seats")
export class SubscriptionSeats extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "team_member_id", nullable: true })
  teamMemberId: number | null;

  @Column("int", { name: "subscription_id", nullable: true })
  subscriptionId: number | null;

  @Column("enum", {
    name: "status",
    enum: ["NONE", "FREE", "PAID", "QUIT"],
    default: () => "'PAID'",
  })
  status: "NONE" | "FREE" | "PAID" | "QUIT";

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

  @Column("tinyint", { name: "isPaid", default: () => "'1'" })
  isPaid: number;

  @Column("datetime", { name: "startAt", nullable: true })
  startAt: Date | null;

  @Column("datetime", { name: "finishAt", nullable: true })
  finishAt: Date | null;

  @Column("datetime", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @Column("text", { name: "memo", nullable: true })
  memo: string | null;

  @ManyToOne(
    () => Subscriptions,
    (subscriptions) => subscriptions.subscriptionSeats,
    { onDelete: "SET NULL", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "subscription_id", referencedColumnName: "id" }])
  subscription: Subscriptions;

  @ManyToOne(
    () => TeamMembers,
    (teamMembers) => teamMembers.subscriptionSeats,
    { onDelete: "SET NULL", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "team_member_id", referencedColumnName: "id" }])
  teamMember: TeamMembers;

  @RelationId(
    (subscriptionSeats: SubscriptionSeats) => subscriptionSeats.subscription
  )
  subscriptionId2: number | null;

  @RelationId(
    (subscriptionSeats: SubscriptionSeats) => subscriptionSeats.teamMember
  )
  teamMemberId2: number | null;
}
