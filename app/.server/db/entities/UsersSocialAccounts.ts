import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("IDX_15a2153fed5a6017ec824983be", ["email"], {})
@Index("social_account_identity", ["provider", "uid"], { unique: true })
@Entity("users_social_accounts")
export class UsersSocialAccounts extends BaseEntity {
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

  @Column("varchar", { name: "provider", length: 255 })
  provider: string;

  @Column("varchar", { name: "uid", length: 255 })
  uid: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "profileImageUrl", nullable: true })
  profileImageUrl: string | null;

  @ManyToOne(() => Users, (users) => users.usersSocialAccounts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
