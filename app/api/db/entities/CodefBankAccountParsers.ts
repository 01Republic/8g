import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Products } from "./Products";
import { CodefBillingHistories } from "./CodefBillingHistories";

@Entity("codef_bank_account_parsers")
export class CodefBankAccountParsers {
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

  @ManyToOne(() => Products, (products) => products.codefBankAccountParsers, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;

  @OneToMany(
    () => CodefBillingHistories,
    (codefBillingHistories) => codefBillingHistories.codefBankAccountParser
  )
  codefBillingHistories: CodefBillingHistories[];
}
