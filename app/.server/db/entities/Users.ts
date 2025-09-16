import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProductAddedAlerts } from "./ProductAddedAlerts";
import { SignedHistories } from "./SignedHistories";
import { SyncHistories } from "./SyncHistories";
import { UserDevices } from "./UserDevices";
import { UserDetails } from "./UserDetails";
import { UsersSocialAccounts } from "./UsersSocialAccounts";

@Index("IDX_97672ac88f789774dd47f7c8be", ["email"], { unique: true })
@Entity("users")
export class Users extends BaseEntity {
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

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "phone", length: 255 })
  phone: string;

  @Column("datetime", {
    name: "serviceUsageTermAgreedAt",
    comment: "서비스 이용약관 동의 여부",
    default: () => "CURRENT_TIMESTAMP",
  })
  serviceUsageTermAgreedAt: Date;

  @Column("datetime", {
    name: "privacyPolicyTermAgreedAt",
    comment: "개인정보 활용 동의 여부",
    default: () => "CURRENT_TIMESTAMP",
  })
  privacyPolicyTermAgreedAt: Date;

  @Column("tinyint", {
    name: "isAdmin",
    comment: "운영자 여부",
    default: () => "'0'",
  })
  isAdmin: number;

  @Column("text", {
    name: "webPushSubscription",
    nullable: true,
    comment: "웹푸시 토큰",
  })
  webPushSubscription: string | null;

  @Column("datetime", {
    name: "marketingTermAgreedAt",
    nullable: true,
    comment: "마케팅 수신 동의 여부",
  })
  marketingTermAgreedAt: Date | null;

  @Column("datetime", {
    name: "emailNoticeAllowedAt",
    nullable: true,
    comment: "이메일 알림 수신 허용 여부",
  })
  emailNoticeAllowedAt: Date | null;

  @Column("datetime", {
    name: "smsNoticeAllowedAt",
    nullable: true,
    comment: "SMS 알림 수신 허용 여부",
  })
  smsNoticeAllowedAt: Date | null;

  @Column("enum", { name: "locale", nullable: true, enum: ["ko", "en"] })
  locale: "ko" | "en" | null;

  @Column("text", { name: "profileImgUrl" })
  profileImgUrl: string;

  @Column("varchar", { name: "job", nullable: true, length: 255 })
  job: string | null;

  @OneToMany(
    () => ProductAddedAlerts,
    (productAddedAlerts) => productAddedAlerts.user
  )
  productAddedAlerts: ProductAddedAlerts[];

  @OneToMany(() => SignedHistories, (signedHistories) => signedHistories.user)
  signedHistories: SignedHistories[];

  @OneToMany(() => SyncHistories, (syncHistories) => syncHistories.user)
  syncHistories: SyncHistories[];

  @OneToMany(() => UserDevices, (userDevices) => userDevices.user)
  userDevices: UserDevices[];

  @OneToMany(() => UserDetails, (userDetails) => userDetails.user)
  userDetails: UserDetails[];

  @OneToMany(
    () => UsersSocialAccounts,
    (usersSocialAccounts) => usersSocialAccounts.user
  )
  usersSocialAccounts: UsersSocialAccounts[];
}
