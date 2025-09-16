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
import { Organizations } from "./Organizations";

@Index("IDX_06520b6f02f50141cb3b3a33c2", ["authKey"], { unique: true })
@Index("IDX_555ff44f59f62a21439865a985", ["isActive"], {})
@Index("IDX_2c897ac376f1b7437f0e130de2", ["isMajor"], {})
@Index("IDX_2c583834ef7f36582ac7141b6a", ["expiredAt"], {})
@Index("IDX_039b785c00a749d94585a0f20b", ["deletedAt"], {})
@Entity("scordi_payment_methods")
export class ScordiPaymentMethods extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("enum", {
    name: "provider",
    enum: ["TossPayment"],
    default: () => "'TossPayment'",
  })
  provider: "TossPayment";

  @Column("varchar", { name: "mid", length: 255 })
  mid: string;

  @Column("tinyint", { name: "isActive" })
  isActive: number;

  @Column("varchar", { name: "billingKey", length: 255 })
  billingKey: string;

  @Column("varchar", { name: "customerKey", length: 255 })
  customerKey: string;

  @Column("datetime", { name: "authenticatedAt" })
  authenticatedAt: Date;

  @Column("varchar", { name: "cardCompany", length: 255 })
  cardCompany: string;

  @Column("varchar", { name: "cardNumber", length: 255 })
  cardNumber: string;

  @Column("text", { name: "response" })
  response: string;

  @Column("tinyint", { name: "isMajor", default: () => "'0'" })
  isMajor: number;

  @Column("datetime", { name: "expiredAt", nullable: true })
  expiredAt: Date | null;

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

  @Column("datetime", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @Column("varchar", { name: "authKey", unique: true, length: 255 })
  authKey: string;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.scordiPaymentMethods,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @RelationId(
    (scordiPaymentMethods: ScordiPaymentMethods) =>
      scordiPaymentMethods.organization
  )
  organizationId: number | null;
}
