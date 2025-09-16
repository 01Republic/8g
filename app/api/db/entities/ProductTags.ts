import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("IDX_2e771a89fb5e8d08bd0e6f59fe", ["productId"], {})
@Index("IDX_d04421bc9851476cedbaea2c13", ["tagId"], {})
@Index("OneToOne", ["productId", "tagId"], { unique: true })
@Entity("product_tags")
export class ProductTags {
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

  @Column("int", { name: "product_id" })
  productId: number;

  @Column("int", { name: "tag_id" })
  tagId: number;
}
