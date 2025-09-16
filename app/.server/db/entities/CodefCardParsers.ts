import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { CodefBillingHistories } from "./CodefBillingHistories";
import { Products } from "./Products";

@Entity("codef_card_parsers")
export class CodefCardParsers extends BaseEntity {
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

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "query", nullable: true })
  query: string | null;

  @Column("enum", {
    name: "groupingMethod",
    enum: ["by-date", "by-card", "by-message"],
    default: () => "'by-date'",
  })
  groupingMethod: "by-date" | "by-card" | "by-message";

  @Column("enum", {
    name: "fixedRecurringType",
    nullable: true,
    enum: ["None", "Monthly", "Yearly", "Onetime"],
  })
  fixedRecurringType: "None" | "Monthly" | "Yearly" | "Onetime" | null;

  @Column("text", { name: "memo", nullable: true })
  memo: string | null;

  @Column("tinyint", { name: "isActive", default: () => "'0'" })
  isActive: number;

  @OneToMany(
    () => CodefBillingHistories,
    (codefBillingHistories) => codefBillingHistories.codefCardParser
  )
  codefBillingHistories: CodefBillingHistories[];

  @ManyToOne(() => Products, (products) => products.codefCardParsers, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @RelationId((codefCardParsers: CodefCardParsers) => codefCardParsers.product)
  productId: number;
}
