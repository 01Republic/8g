import { Column, Entity } from "typeorm";

@Entity("typeorm_metadata")
export class TypeormMetadata {
  @Column("varchar", { name: "type", length: 255 })
  type: string;

  @Column("varchar", { name: "database", nullable: true, length: 255 })
  database: string | null;

  @Column("varchar", { name: "schema", nullable: true, length: 255 })
  schema: string | null;

  @Column("varchar", { name: "table", nullable: true, length: 255 })
  table: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("text", { name: "value", nullable: true })
  value: string | null;
}
