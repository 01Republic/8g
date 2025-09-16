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
import { CodefAccounts } from "./CodefAccounts";
import { Organizations } from "./Organizations";

@Entity("codef_connected_identities")
export class CodefConnectedIdentities extends BaseEntity {
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

  @Column("varchar", { name: "connectedId", length: 255 })
  connectedId: string;

  @OneToMany(
    () => CodefAccounts,
    (codefAccounts) => codefAccounts.codefConnectedIdentity
  )
  codefAccounts: CodefAccounts[];

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.codefConnectedIdentities,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @RelationId(
    (codefConnectedIdentities: CodefConnectedIdentities) =>
      codefConnectedIdentities.organization
  )
  organizationId: number;
}
