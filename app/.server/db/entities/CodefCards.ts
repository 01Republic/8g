import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { CodefBillingHistories } from "./CodefBillingHistories";
import { CreditCard } from "./CreditCard";
import { CodefAccounts } from "./CodefAccounts";

@Index("IDX_114dc8aba5d765dbe21b27ed08", ["resCardNo"], {})
@Entity("codef_cards")
export class CodefCards extends BaseEntity {
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

  @Column("varchar", { name: "resCardNo", length: 255 })
  resCardNo: string;

  @Column("varchar", { name: "resUserNm", length: 255 })
  resUserNm: string;

  @Column("varchar", { name: "resCardName", length: 255 })
  resCardName: string;

  @Column("varchar", { name: "resCardType", length: 255 })
  resCardType: string;

  @Column("tinyint", { name: "isSleep", default: () => "'0'" })
  isSleep: number;

  @Column("tinyint", { name: "isTraffic", nullable: true })
  isTraffic: number | null;

  @Column("varchar", { name: "resImageLink", length: 255 })
  resImageLink: string;

  @Column("varchar", { name: "resValidPeriod", length: 255 })
  resValidPeriod: string;

  @Column("varchar", { name: "resIssueDate", nullable: true, length: 255 })
  resIssueDate: string | null;

  @Column("varchar", { name: "resReissueDate", nullable: true, length: 255 })
  resReissueDate: string | null;

  @Column("varchar", { name: "resState", nullable: true, length: 255 })
  resState: string | null;

  @Column("date", { name: "syncedStartDate", nullable: true })
  syncedStartDate: string | null;

  @Column("date", { name: "syncedEndDate", nullable: true })
  syncedEndDate: string | null;

  @Column("datetime", { name: "lastSyncedAt", nullable: true })
  lastSyncedAt: Date | null;

  @Column("int", { name: "codefBillingHistoryCount", default: () => "'0'" })
  codefBillingHistoryCount: number;

  @Column("tinyint", { name: "isSyncRunning", default: () => "'0'" })
  isSyncRunning: number;

  @OneToMany(
    () => CodefBillingHistories,
    (codefBillingHistories) => codefBillingHistories.codefCard
  )
  codefBillingHistories: CodefBillingHistories[];

  @ManyToOne(() => CreditCard, (creditCard) => creditCard.codefCards, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "credit_card_id", referencedColumnName: "id" }])
  creditCard: CreditCard;

  @ManyToOne(() => CodefAccounts, (codefAccounts) => codefAccounts.codefCards, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "codef_account_id", referencedColumnName: "id" }])
  codefAccount: CodefAccounts;

  @RelationId((codefCards: CodefCards) => codefCards.creditCard)
  creditCardId: number | null;

  @RelationId((codefCards: CodefCards) => codefCards.codefAccount)
  codefAccountId: number;
}
