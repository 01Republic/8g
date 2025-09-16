import {
  BaseEntity,
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
import { InvoiceApps } from "./InvoiceApps";
import { Posts } from "./Posts";
import { ProductAddedAlerts } from "./ProductAddedAlerts";
import { ProductBillingCycles } from "./ProductBillingCycles";
import { ProductPaymentPlans } from "./ProductPaymentPlans";
import { ProductSimilarNames } from "./ProductSimilarNames";
import { ProductTags } from "./ProductTags";
import { Subscriptions } from "./Subscriptions";
import { Workspaces } from "./Workspaces";

@Index("IDX_e711ae1eb3998a72d6a2374ac3", ["nameKo"], { unique: true })
@Index("IDX_89fa0ea49c19b518e9ad84ba3e", ["nameEn"], { unique: true })
@Index("IDX_7c0ee139fe15ba037a5cc83737", ["searchText"], {})
@Index("IDX_8abf41fccf9611ed99fceff19d", ["saasCollectionExposePriority"], {})
@Entity("products")
export class Products extends BaseEntity {
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

  @Column("varchar", { name: "name_ko", unique: true, length: 255 })
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

  @Column("varchar", { name: "name_en", unique: true, length: 255 })
  nameEn: string;

  @Column("int", { name: "saasCollectionExposePriority", default: () => "'0'" })
  saasCollectionExposePriority: number;

  @OneToMany(() => Accounts, (accounts) => accounts.product)
  accounts: Accounts[];

  @OneToMany(() => Accounts, (accounts) => accounts.product_2)
  accounts2: Accounts[];

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

  @OneToMany(() => InvoiceApps, (invoiceApps) => invoiceApps.product)
  invoiceApps: InvoiceApps[];

  @OneToMany(() => Posts, (posts) => posts.product)
  posts: Posts[];

  @OneToMany(() => Posts, (posts) => posts.product_2)
  posts2: Posts[];

  @OneToMany(
    () => ProductAddedAlerts,
    (productAddedAlerts) => productAddedAlerts.product
  )
  productAddedAlerts: ProductAddedAlerts[];

  @OneToMany(
    () => ProductAddedAlerts,
    (productAddedAlerts) => productAddedAlerts.product_2
  )
  productAddedAlerts2: ProductAddedAlerts[];

  @OneToMany(
    () => ProductBillingCycles,
    (productBillingCycles) => productBillingCycles.product
  )
  productBillingCycles: ProductBillingCycles[];

  @OneToMany(
    () => ProductBillingCycles,
    (productBillingCycles) => productBillingCycles.product_2
  )
  productBillingCycles2: ProductBillingCycles[];

  @OneToMany(
    () => ProductPaymentPlans,
    (productPaymentPlans) => productPaymentPlans.product
  )
  productPaymentPlans: ProductPaymentPlans[];

  @OneToMany(
    () => ProductPaymentPlans,
    (productPaymentPlans) => productPaymentPlans.product_2
  )
  productPaymentPlans2: ProductPaymentPlans[];

  @OneToMany(
    () => ProductSimilarNames,
    (productSimilarNames) => productSimilarNames.product
  )
  productSimilarNames: ProductSimilarNames[];

  @OneToMany(() => ProductTags, (productTags) => productTags.product)
  productTags: ProductTags[];

  @OneToMany(() => ProductTags, (productTags) => productTags.product_2)
  productTags2: ProductTags[];

  @OneToMany(() => Subscriptions, (subscriptions) => subscriptions.product)
  subscriptions: Subscriptions[];

  @OneToMany(() => Workspaces, (workspaces) => workspaces.product)
  workspaces: Workspaces[];
}
