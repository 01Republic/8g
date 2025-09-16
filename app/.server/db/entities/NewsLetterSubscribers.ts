import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("news-letter-subscribers")
export class NewsLetterSubscribers extends BaseEntity {
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

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("datetime", { name: "privacyTermAgreedAt", nullable: true })
  privacyTermAgreedAt: Date | null;
}
