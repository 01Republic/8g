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
import { CodefConnectedIdentities } from "./CodefConnectedIdentities";
import { Organizations } from "./Organizations";
import { CodefBankAccounts } from "./CodefBankAccounts";
import { CodefCards } from "./CodefCards";

@Entity("codef_accounts")
export class CodefAccounts extends BaseEntity {
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

  @Column("varchar", {
    name: "company",
    nullable: true,
    comment: "기관명",
    length: 255,
  })
  company: string | null;

  @Column("varchar", {
    name: "countryCode",
    comment: "국가코드 (한국: KR)",
    length: 255,
  })
  countryCode: string;

  @Column("enum", {
    name: "clientType",
    comment: "고객 구분 (개인: P, 기업/법인: B, 통합: A)",
    enum: ["P", "B", "A"],
  })
  clientType: "P" | "B" | "A";

  @Column("varchar", {
    name: "organization",
    comment: "기관코드 (기관코드는 서버 참조)",
    length: 255,
  })
  organization: string;

  @Column("enum", {
    name: "businessType",
    comment: "업무 구분 (은행/저축은행: BK, 카드: CD, 증권: ST, 보험: IS)",
    enum: ["BK", "CD", "ST", "IS"],
  })
  businessType: "BK" | "CD" | "ST" | "IS";

  @Column("enum", {
    name: "loginType",
    comment: "로그인 방식 (인증서: 0, 아이디/패스워드: 1)",
    enum: ["0", "1"],
  })
  loginType: "0" | "1";

  @Column("enum", {
    name: "loginTypeLevel",
    nullable: true,
    comment:
      "로그인구분 [신한/롯데 법인카드의 경우] “0”:USER, “1”:BRANCH, “2”:ADMIN",
    enum: ["0", "1", "2"],
  })
  loginTypeLevel: "0" | "1" | "2" | null;

  @Column("enum", {
    name: "clientTypeLevel",
    nullable: true,
    comment:
      "의뢰인 구분 [회원구분(신한카드만 사용)] “0”:신용카드회원, “1”:체크카드회원, “2”:연구비신용카드회원, “3”:프리플러스회원",
    enum: ["0", "1", "2", "3"],
  })
  clientTypeLevel: "0" | "1" | "2" | "3" | null;

  @Column("varchar", { name: "encUid", nullable: true, length: 255 })
  encUid: string | null;

  @Column("text", { name: "errorData", nullable: true })
  errorData: string | null;

  @Column("datetime", {
    name: "privacyPolicyTermAgreedAt",
    nullable: true,
    comment: "개인정보 활용 동의 여부",
  })
  privacyPolicyTermAgreedAt: Date | null;

  @Column("datetime", {
    name: "serviceUsageTermAgreedAt",
    nullable: true,
    comment: "서비스 이용약관 동의 여부",
  })
  serviceUsageTermAgreedAt: Date | null;

  @Column("int", { name: "codefAssetCount", default: () => "'0'" })
  codefAssetCount: number;

  @Column("int", { name: "assetCount", default: () => "'0'" })
  assetCount: number;

  @Column("tinyint", { name: "isSyncRunning", default: () => "'0'" })
  isSyncRunning: number;

  @ManyToOne(
    () => CodefConnectedIdentities,
    (codefConnectedIdentities) => codefConnectedIdentities.codefAccounts,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([
    { name: "codef_connected_identity_id", referencedColumnName: "id" },
  ])
  codefConnectedIdentity: CodefConnectedIdentities;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.codefAccounts,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization_2: Organizations;

  @OneToMany(
    () => CodefBankAccounts,
    (codefBankAccounts) => codefBankAccounts.codefAccount,
  )
  codefBankAccounts: CodefBankAccounts[];

  @OneToMany(() => CodefCards, (codefCards) => codefCards.codefAccount)
  codefCards: CodefCards[];

  @RelationId(
    (codefAccounts: CodefAccounts) => codefAccounts.codefConnectedIdentity,
  )
  codefConnectedIdentityId: number | null;

  @RelationId((codefAccounts: CodefAccounts) => codefAccounts.organization_2)
  organizationId: number;
}
