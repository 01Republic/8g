import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("gmail_query_presets")
export class GmailQueryPresets extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("tinyint", { name: "inUse", default: () => "'1'" })
  inUse: number;

  @Column("varchar", { name: "about", length: 255 })
  about: string;

  @Column("tinyint", { name: "isPositive", default: () => "'1'" })
  isPositive: number;

  @Column("varchar", { name: "content", length: 255 })
  content: string;

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
}
