import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index(
  "IDX_slackUserId_channelId_eventType",
  ["slackUserId", "channelId", "eventType"],
  {},
)
@Entity("slack_event_log")
export class SlackEventLog extends BaseEntity {
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

  @Column("varchar", { name: "slackUserId", length: 255 })
  slackUserId: string;

  @Column("varchar", { name: "channelId", length: 255 })
  channelId: string;

  @Column("varchar", { name: "eventType", length: 255 })
  eventType: string;
}
