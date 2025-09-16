import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ScordiPayments } from "./ScordiPayments";
import { ScordiPlans } from "./ScordiPlans";
import { Organizations } from "./Organizations";

@Entity("scordi_subscriptions")
export class ScordiSubscriptions extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("tinyint", { name: "isActive", default: () => "'0'" })
  isActive: number;

  @Column("datetime", { name: "startAt", nullable: true })
  startAt: Date | null;

  @Column("datetime", { name: "finishAt", nullable: true })
  finishAt: Date | null;

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
    (scordiPayments) => scordiPayments.scordiSubscription
  )
  scordiPayments: ScordiPayments[];

  @ManyToOne(
    () => ScordiSubscriptions,
    (scordiSubscriptions) => scordiSubscriptions.scordiSubscriptions,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "nextSubscriptionId", referencedColumnName: "id" }])
  nextSubscription: ScordiSubscriptions;

  @OneToMany(
    () => ScordiSubscriptions,
    (scordiSubscriptions) => scordiSubscriptions.nextSubscription
  )
  scordiSubscriptions: ScordiSubscriptions[];

  @ManyToOne(
    () => ScordiPlans,
    (scordiPlans) => scordiPlans.scordiSubscriptions,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "scordi_plan_id", referencedColumnName: "id" }])
  scordiPlan: ScordiPlans;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.scordiSubscriptions,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;
}
