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
import { Products } from "./Products";
import { Tags } from "./Tags";

@Index("OneToOne", ["productId", "tagId"], { unique: true })
@Index("IDX_d04421bc9851476cedbaea2c13", ["tagId"], {})
@Index("IDX_2e771a89fb5e8d08bd0e6f59fe", ["productId"], {})
@Entity("product_tags")
export class ProductTags extends BaseEntity {
  @Column("int", { name: "product_id" })
  productId: number;

  @Column("int", { name: "tag_id" })
  tagId: number;

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

  @ManyToOne(() => Products, (products) => products.productTags, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @ManyToOne(() => Products, (products) => products.productTags2, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product_2: Products;

  @ManyToOne(() => Tags, (tags) => tags.productTags, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tag_id", referencedColumnName: "id" }])
  tag: Tags;

  @ManyToOne(() => Tags, (tags) => tags.productTags2, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "tag_id", referencedColumnName: "id" }])
  tag_2: Tags;

  @RelationId((productTags: ProductTags) => productTags.product)
  productId2: number;

  @RelationId((productTags: ProductTags) => productTags.product_2)
  productId3: number;

  @RelationId((productTags: ProductTags) => productTags.tag)
  tagId2: number;

  @RelationId((productTags: ProductTags) => productTags.tag_2)
  tagId3: number;
}
