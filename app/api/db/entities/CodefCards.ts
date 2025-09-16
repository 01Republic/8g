import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CodefBillingHistories } from "./CodefBillingHistories";

@Index("FK_7393d58891ea213dcb9329ade82", ["creditCardId"], {})
@Index("FK_78c19a4f95716168ed278ae2815", ["codefAccountId"], {})
@Index("IDX_114dc8aba5d765dbe21b27ed08", ["resCardNo"], {})
@Entity("codef_cards")
export class CodefCards {
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

  @Column("int", { name: "codef_account_id" })
  codefAccountId: number;

  @Column("int", { name: "credit_card_id", nullable: true })
  creditCardId: number | null;

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
}
