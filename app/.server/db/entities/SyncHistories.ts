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
import { Users } from "./Users";

@Index("FK_1cb749aceb548cdb63aa99c014c", ["subscriptionId"], {})
@Entity("sync-histories")
export class SyncHistories extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "subscription_id" })
  subscriptionId: number;

  @Column("tinyint", { name: "isScheduled", default: () => "'1'" })
  isScheduled: number;

  @Column("text", { name: "content" })
  content: string;

  @Column("enum", {
    name: "resultStatus",
    enum: ["IN_PROGRESS", "SUCCESS", "FAILED", "CANCELED"],
    default: () => "'IN_PROGRESS'",
  })
  resultStatus: "IN_PROGRESS" | "SUCCESS" | "FAILED" | "CANCELED";

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

  @Column("datetime", { name: "finishedAt", nullable: true })
  finishedAt: Date | null;

  @ManyToOne(
    () => Subscriptions,
    (subscriptions) => subscriptions.syncHistories,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "subscription_id", referencedColumnName: "id" }])
  subscription: Subscriptions;

  @ManyToOne(() => Users, (users) => users.syncHistories, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @RelationId((syncHistories: SyncHistories) => syncHistories.subscription)
  subscriptionId2: number;

  @RelationId((syncHistories: SyncHistories) => syncHistories.user)
  userId: number | null;
}
