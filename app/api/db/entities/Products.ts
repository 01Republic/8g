import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Accounts } from "./Accounts";
import { CodefBankAccountParsers } from "./CodefBankAccountParsers";
import { CodefCardParsers } from "./CodefCardParsers";
import { EmailParsers } from "./EmailParsers";
import { Posts } from "./Posts";
import { ProductAddedAlerts } from "./ProductAddedAlerts";
import { ProductBillingCycles } from "./ProductBillingCycles";
import { ProductPaymentPlans } from "./ProductPaymentPlans";
import { ProductSimilarNames } from "./ProductSimilarNames";

@Index("IDX_8abf41fccf9611ed99fceff19d", ["saasCollectionExposePriority"], {})
@Entity("products")
export class Products {
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

  @Column("varchar", { name: "name_ko", length: 255 })
  nameKo: string;

  @Column("varchar", { name: "searchText", length: 255 })
  searchText: string;

  @Column("text", { name: "desc" })
  desc: string;

  @Column("text", { name: "image" })
  image: string;

  @Column("tinyint", { name: "isAutoTrackable" })
  isAutoTrackable: number;

  @Column("tinyint", { name: "isFreeTierAvailable" })
  isFreeTierAvailable: number;

  @Column("int", { name: "connectedOrgCount", default: () => "'0'" })
  connectedOrgCount: number;

  @Column("enum", {
    name: "connectMethod",
    enum: ["PREPARE", "MANUAL", "AUTO"],
    default: () => "'PREPARE'",
  })
  connectMethod: "PREPARE" | "MANUAL" | "AUTO";

  @Column("text", { name: "tagline", nullable: true })
  tagline: string | null;

  @Column("varchar", { name: "homepageUrl", length: 255 })
  homepageUrl: string;

  @Column("varchar", { name: "pricingPageUrl", length: 255 })
  pricingPageUrl: string;

  @Column("varchar", { name: "companyName", length: 255 })
  companyName: string;

  @Column("varchar", { name: "orgPageUrlScheme", length: 255 })
  orgPageUrlScheme: string;

  @Column("varchar", { name: "billingInfoPageUrlScheme", length: 255 })
  billingInfoPageUrlScheme: string;

  @Column("varchar", { name: "planComparePageUrlScheme", length: 255 })
  planComparePageUrlScheme: string;

  @Column("varchar", { name: "upgradePlanPageUrlScheme", length: 255 })
  upgradePlanPageUrlScheme: string;

  @Column("varchar", { name: "updatePayMethodUrlScheme", length: 255 })
  updatePayMethodUrlScheme: string;

  @Column("text", { name: "ogImageUrl", nullable: true })
  ogImageUrl: string | null;

  @Column("varchar", { name: "name_en", length: 255 })
  nameEn: string;

  @Column("int", { name: "saasCollectionExposePriority", default: () => "'0'" })
  saasCollectionExposePriority: number;

  @OneToMany(() => Accounts, (accounts) => accounts.product)
  accounts: Accounts[];

  @OneToMany(
    () => CodefBankAccountParsers,
    (codefBankAccountParsers) => codefBankAccountParsers.product
  )
  codefBankAccountParsers: CodefBankAccountParsers[];

  @OneToMany(
    () => CodefCardParsers,
    (codefCardParsers) => codefCardParsers.product
  )
  codefCardParsers: CodefCardParsers[];

  @OneToMany(() => EmailParsers, (emailParsers) => emailParsers.product)
  emailParsers: EmailParsers[];

  @OneToMany(() => Posts, (posts) => posts.product)
  posts: Posts[];

  @OneToMany(
    () => ProductAddedAlerts,
    (productAddedAlerts) => productAddedAlerts.product
  )
  productAddedAlerts: ProductAddedAlerts[];

  @OneToMany(
    () => ProductBillingCycles,
    (productBillingCycles) => productBillingCycles.product
  )
  productBillingCycles: ProductBillingCycles[];

  @OneToMany(
    () => ProductPaymentPlans,
    (productPaymentPlans) => productPaymentPlans.product
  )
  productPaymentPlans: ProductPaymentPlans[];

  @OneToMany(
    () => ProductSimilarNames,
    (productSimilarNames) => productSimilarNames.product
  )
  productSimilarNames: ProductSimilarNames[];
}
