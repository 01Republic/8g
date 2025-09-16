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
import { ScordiPaymentRefunds } from "./ScordiPaymentRefunds";
import { Organizations } from "./Organizations";
import { ScordiSubscriptions } from "./ScordiSubscriptions";
import { ScordiPlans } from "./ScordiPlans";

@Entity("scordi_payments")
export class ScordiPayments extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "planName", length: 255 })
  planName: string;

  @Column("int", { name: "price" })
  price: number;

  @Column("enum", {
    name: "status",
    enum: [
      "INITIATED",
      "PENDING",
      "SUCCESS",
      "FAILED",
      "CANCELED",
      "PARTIAL_CANCELED",
    ],
    default: () => "'INITIATED'",
  })
  status:
    | "INITIATED"
    | "PENDING"
    | "SUCCESS"
    | "FAILED"
    | "CANCELED"
    | "PARTIAL_CANCELED";

  @Column("varchar", { name: "customerName", length: 255 })
  customerName: string;

  @Column("varchar", { name: "customerPhone", length: 255 })
  customerPhone: string;

  @Column("varchar", { name: "customerEmail", length: 255 })
  customerEmail: string;

  @Column("varchar", {
    name: "customerIdentityNumber",
    nullable: true,
    length: 255,
  })
  customerIdentityNumber: string | null;

  @Column("varchar", { name: "cardNumber", nullable: true, length: 255 })
  cardNumber: string | null;

  @Column("text", { name: "response", nullable: true })
  response: string | null;

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
    () => ScordiPaymentRefunds,
    (scordiPaymentRefunds) => scordiPaymentRefunds.scordiPayment
  )
  scordiPaymentRefunds: ScordiPaymentRefunds[];

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.scordiPayments,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(
    () => ScordiSubscriptions,
    (scordiSubscriptions) => scordiSubscriptions.scordiPayments,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "scordi_subscription_id", referencedColumnName: "id" }])
  scordiSubscription: ScordiSubscriptions;

  @ManyToOne(() => ScordiPlans, (scordiPlans) => scordiPlans.scordiPayments, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "scordi_plan_id", referencedColumnName: "id" }])
  scordiPlan: ScordiPlans;

  @RelationId((scordiPayments: ScordiPayments) => scordiPayments.organization)
  organizationId: number | null;

  @RelationId(
    (scordiPayments: ScordiPayments) => scordiPayments.scordiSubscription
  )
  scordiSubscriptionId: number | null;

  @RelationId((scordiPayments: ScordiPayments) => scordiPayments.scordiPlan)
  scordiPlanId: number | null;
}
