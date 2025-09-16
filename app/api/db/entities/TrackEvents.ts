import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("track-events")
export class TrackEvents {
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

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "kind", length: 255 })
  kind: string;

  @Column("text", { name: "info" })
  info: string;
}
