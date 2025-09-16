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
import { NotificationTemplates } from "./NotificationTemplates";
import { Memberships } from "./Memberships";

@Index("IDX_5d4d04038468b343e07bbb8b3c", ["willSendAt"], {})
@Index("IDX_33b985057189c8d5125ed834af", ["sentAt"], {})
@Index("IDX_3084934ef677da3ebc3269ed06", ["readAt"], {})
@Index("IDX_619c487f6e83d381f45d451844", ["deletedAt"], {})
@Entity("notification_messages")
export class NotificationMessages extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "content", nullable: true })
  content: string | null;

  @Column("varchar", { name: "url", length: 255 })
  url: string;

  @Column("enum", {
    name: "target",
    enum: ["_self", "_blank", "_parent", "_top"],
    default: () => "'_self'",
  })
  target: "_self" | "_blank" | "_parent" | "_top";

  @Column("datetime", { name: "willSendAt", nullable: true })
  willSendAt: Date | null;

  @Column("datetime", { name: "sentAt", nullable: true })
  sentAt: Date | null;

  @Column("datetime", { name: "readAt", nullable: true })
  readAt: Date | null;

  @Column("datetime", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

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
    () => NotificationTemplates,
    (notificationTemplates) => notificationTemplates.notificationMessages,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "notification_template_id", referencedColumnName: "id" },
  ])
  notificationTemplate: NotificationTemplates;

  @ManyToOne(
    () => Memberships,
    (memberships) => memberships.notificationMessages,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "membership_id", referencedColumnName: "id" }])
  membership: Memberships;

  @RelationId(
    (notificationMessages: NotificationMessages) =>
      notificationMessages.notificationTemplate
  )
  notificationTemplateId: number;

  @RelationId(
    (notificationMessages: NotificationMessages) =>
      notificationMessages.membership
  )
  membershipId: number;
}
