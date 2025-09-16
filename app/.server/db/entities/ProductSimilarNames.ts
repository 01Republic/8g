import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IntegrationGoogleWorkspaceOauthTokenActivities } from "./IntegrationGoogleWorkspaceOauthTokenActivities";
import { Products } from "./Products";

@Entity("product_similar_names")
export class ProductSimilarNames extends BaseEntity {
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

  @Column("tinyint", { name: "isBlock", default: () => "'0'" })
  isBlock: number;

  @OneToMany(
    () => IntegrationGoogleWorkspaceOauthTokenActivities,
    (integrationGoogleWorkspaceOauthTokenActivities) =>
      integrationGoogleWorkspaceOauthTokenActivities.productSimilarName
  )
  integrationGoogleWorkspaceOauthTokenActivities: IntegrationGoogleWorkspaceOauthTokenActivities[];

  @ManyToOne(() => Products, (products) => products.productSimilarNames, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;
}
