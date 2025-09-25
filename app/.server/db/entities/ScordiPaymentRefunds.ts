import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { ScordiPayments } from "./ScordiPayments";

@Entity("scordi_payment_refunds")
export class ScordiPaymentRefunds extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

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

  @ManyToOne(
    () => ScordiPayments,
    (scordiPayments) => scordiPayments.scordiPaymentRefunds,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "scordi_payment_id", referencedColumnName: "id" }])
  scordiPayment: ScordiPayments;

  @RelationId(
    (scordiPaymentRefunds: ScordiPaymentRefunds) =>
      scordiPaymentRefunds.scordiPayment,
  )
  scordiPaymentId: number;
}
