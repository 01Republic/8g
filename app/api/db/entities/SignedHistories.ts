import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Subscriptions } from "./Subscriptions";
import { TeamMembers } from "./TeamMembers";
import { Users } from "./Users";
import { Accounts } from "./Accounts";

@Entity("signed_histories")
export class SignedHistories {
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

  @Column("varchar", { name: "signed_ip", nullable: true, length: 255 })
  signedIp: string | null;

  @Column("datetime", { name: "signed_at", nullable: true })
  signedAt: Date | null;

  @ManyToOne(
    () => Subscriptions,
    (subscriptions) => subscriptions.signedHistories,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "subscription_id", referencedColumnName: "id" }])
  subscription: Subscriptions;

  @ManyToOne(() => TeamMembers, (teamMembers) => teamMembers.signedHistories, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "team_member_id", referencedColumnName: "id" }])
  teamMember: TeamMembers;

  @ManyToOne(() => Users, (users) => users.signedHistories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Accounts, (accounts) => accounts.signedHistories, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "account_id", referencedColumnName: "id" }])
  account: Accounts;
}
