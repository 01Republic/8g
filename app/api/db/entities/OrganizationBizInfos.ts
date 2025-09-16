import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organizations } from "./Organizations";

@Entity("organization_biz_infos")
export class OrganizationBizInfos {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "bizNo", nullable: true, length: 255 })
  bizNo: string | null;

  @Column("varchar", { name: "employeeScale", nullable: true, length: 255 })
  employeeScale: string | null;

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
    () => Organizations,
    (organizations) => organizations.organizationBizInfos,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;
}
