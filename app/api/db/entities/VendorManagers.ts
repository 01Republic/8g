import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VendorCompanies } from "./VendorCompanies";
import { VendorContracts } from "./VendorContracts";

@Entity("vendor-managers")
export class VendorManagers {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "email", nullable: true, length: 255 })
  email: string | null;

  @Column("varchar", { name: "phone", nullable: true, length: 255 })
  phone: string | null;

  @Column("varchar", { name: "job_name", nullable: true, length: 255 })
  jobName: string | null;

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

  @ManyToOne(
    () => VendorCompanies,
    (vendorCompanies) => vendorCompanies.vendorManagers,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "vendor_company_id", referencedColumnName: "id" }])
  vendorCompany: VendorCompanies;

  @OneToMany(
    () => VendorContracts,
    (vendorContracts) => vendorContracts.vendorManager
  )
  vendorContracts: VendorContracts[];
}
