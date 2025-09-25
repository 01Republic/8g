import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ScordiPayments } from "./ScordiPayments";
import { ScordiSubscriptions } from "./ScordiSubscriptions";

@Entity("scordi_plans")
export class ScordiPlans extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("int", { name: "price" })
  price: number;

  @Column("int", { name: "regularPrice", default: () => "'0'" })
  regularPrice: number;

  @Column("tinyint", { name: "isPublic", default: () => "'0'" })
  isPublic: number;

  @Column("tinyint", { name: "isActive", default: () => "'0'" })
  isActive: number;

  @Column("tinyint", { name: "isCustomInquired", default: () => "'0'" })
  isCustomInquired: number;

  @Column("enum", {
    name: "stepType",
    enum: ["Day", "Week", "Month", "Year", "No"],
  })
  stepType: "Day" | "Week" | "Month" | "Year" | "No";

  @Column("int", { name: "stepSize", default: () => "'1'" })
  stepSize: number;

  @Column("enum", {
    name: "nextStrategy",
    enum: ["RECURRING", "BLOCK"],
    default: () => "'RECURRING'",
  })
  nextStrategy: "RECURRING" | "BLOCK";

  @Column("varchar", { name: "secretCode", length: 255 })
  secretCode: string;

  @Column("int", { name: "priority", default: () => "'9999'" })
  priority: number;

  @Column("text", { name: "extraData", nullable: true })
  extraData: string | null;

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

  @OneToMany(
    () => ScordiPayments,
    (scordiPayments) => scordiPayments.scordiPlan,
  )
  scordiPayments: ScordiPayments[];

  @OneToMany(
    () => ScordiSubscriptions,
    (scordiSubscriptions) => scordiSubscriptions.scordiPlan,
  )
  scordiSubscriptions: ScordiSubscriptions[];
}
