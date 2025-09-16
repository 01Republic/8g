import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VendorManagers } from "./VendorManagers";
import { Organizations } from "./Organizations";
import { VendorContracts } from "./VendorContracts";

@Entity("vendor_companies")
export class VendorCompanies extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "profileImgUrl", nullable: true })
  profileImgUrl: string | null;

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

  @OneToMany(
    () => VendorManagers,
    (vendorManagers) => vendorManagers.vendorCompany
  )
  vendorManagers: VendorManagers[];

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.vendorCompanies,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @OneToMany(
    () => VendorContracts,
    (vendorContracts) => vendorContracts.vendorCompany
  )
  vendorContracts: VendorContracts[];
}
