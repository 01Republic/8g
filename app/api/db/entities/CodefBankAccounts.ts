import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CodefBillingHistories } from "./CodefBillingHistories";

@Index("FK_752a4360350e321bf9a074d4135", ["bankAccountId"], {})
@Index("FK_db3f3ce4793532438a94ffb6a22", ["codefAccountId"], {})
@Entity("codef_bank_accounts")
export class CodefBankAccounts {
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

  @Column("int", { name: "bank_account_id", nullable: true })
  bankAccountId: number | null;

  @Column("varchar", { name: "resAccountDeposit", length: 255 })
  resAccountDeposit: string;

  @Column("varchar", { name: "resAccount", length: 255 })
  resAccount: string;

  @Column("varchar", { name: "resAccountDisplay", length: 255 })
  resAccountDisplay: string;

  @Column("varchar", { name: "resAccountName", length: 255 })
  resAccountName: string;

  @Column("varchar", { name: "resAccountCurrency", length: 255 })
  resAccountCurrency: string;

  @Column("varchar", { name: "resAccountBalance", length: 255 })
  resAccountBalance: string;

  @Column("varchar", {
    name: "resAccountStartDate",
    nullable: true,
    length: 255,
  })
  resAccountStartDate: string | null;

  @Column("varchar", { name: "resAccountEndDate", nullable: true, length: 255 })
  resAccountEndDate: string | null;

  @Column("varchar", {
    name: "resAccountNickName",
    nullable: true,
    length: 255,
  })
  resAccountNickName: string | null;

  @Column("varchar", {
    name: "resOverdraftAcctYN",
    nullable: true,
    length: 255,
  })
  resOverdraftAcctYn: string | null;

  @Column("varchar", { name: "resLastTranDate", nullable: true, length: 255 })
  resLastTranDate: string | null;

  @Column("varchar", { name: "resLoanKind", nullable: true, length: 255 })
  resLoanKind: string | null;

  @Column("varchar", { name: "resLoanBalance", nullable: true, length: 255 })
  resLoanBalance: string | null;

  @Column("varchar", { name: "resLoanStartDate", nullable: true, length: 255 })
  resLoanStartDate: string | null;

  @Column("varchar", { name: "resLoanEndDate", nullable: true, length: 255 })
  resLoanEndDate: string | null;

  @Column("varchar", { name: "resEarningsRate", nullable: true, length: 255 })
  resEarningsRate: string | null;

  @Column("varchar", {
    name: "resAccountInvestedCost",
    nullable: true,
    length: 255,
  })
  resAccountInvestedCost: string | null;

  @Column("varchar", {
    name: "resAccountLoanExecNo",
    nullable: true,
    length: 255,
  })
  resAccountLoanExecNo: string | null;

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
    (codefBillingHistories) => codefBillingHistories.codefBankAccount
  )
  codefBillingHistories: CodefBillingHistories[];
}
