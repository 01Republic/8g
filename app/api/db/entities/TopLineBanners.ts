import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("top_line_banners")
export class TopLineBanners {
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

  @Column("varchar", { name: "code", length: 255 })
  code: string;

  @Column("varchar", { name: "text", length: 255 })
  text: string;

  @Column("varchar", { name: "url", nullable: true, length: 255 })
  url: string | null;

  @Column("tinyint", { name: "animation", default: () => "'1'" })
  animation: number;

  @Column("tinyint", { name: "fixed", default: () => "'0'" })
  fixed: number;

  @Column("int", { name: "timeout", nullable: true })
  timeout: number | null;

  @Column("enum", {
    name: "theme",
    enum: [
      "cardInfo",
      "emailInfo",
      "waring",
      "danger",
      "basicInfo",
      "thanksTo",
    ],
    default: () => "'basicInfo'",
  })
  theme:
    | "cardInfo"
    | "emailInfo"
    | "waring"
    | "danger"
    | "basicInfo"
    | "thanksTo";
}
