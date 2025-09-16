import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { VendorCompanies } from "./VendorCompanies";
import { Subscriptions } from "./Subscriptions";
import { VendorManagers } from "./VendorManagers";

@Entity("vendor_contracts")
export class VendorContracts extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "memo", nullable: true })
  memo: string | null;

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

  @ManyToOne(
    () => VendorCompanies,
    (vendorCompanies) => vendorCompanies.vendorContracts,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "vendor_company_id", referencedColumnName: "id" }])
  vendorCompany: VendorCompanies;

  @ManyToOne(
    () => Subscriptions,
    (subscriptions) => subscriptions.vendorContracts,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "subscription_id", referencedColumnName: "id" }])
  subscription: Subscriptions;

  @ManyToOne(
    () => VendorManagers,
    (vendorManagers) => vendorManagers.vendorContracts,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "vendor_manager_id", referencedColumnName: "id" }])
  vendorManager: VendorManagers;

  @RelationId(
    (vendorContracts: VendorContracts) => vendorContracts.vendorCompany
  )
  vendorCompanyId: number;

  @RelationId(
    (vendorContracts: VendorContracts) => vendorContracts.subscription
  )
  subscriptionId: number;

  @RelationId(
    (vendorContracts: VendorContracts) => vendorContracts.vendorManager
  )
  vendorManagerId: number | null;
}
