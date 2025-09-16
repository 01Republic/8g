import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NotificationMessages } from "./NotificationMessages";

@Entity("notification_templates")
export class NotificationTemplates {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("varchar", { name: "about", length: 255 })
  about: string;

  @Column("varchar", { name: "titleTemplate", length: 255 })
  titleTemplate: string;

  @Column("text", { name: "contentTemplate", nullable: true })
  contentTemplate: string | null;

  @Column("datetime", { name: "activatedAt", nullable: true })
  activatedAt: Date | null;

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
    () => NotificationMessages,
    (notificationMessages) => notificationMessages.notificationTemplate
  )
  notificationMessages: NotificationMessages[];
}
