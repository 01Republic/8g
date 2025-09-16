import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Organizations } from "./Organizations";
import { Memberships } from "./Memberships";

@Entity("roles")
export class Roles extends BaseEntity {
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

  @Column("enum", { name: "name", enum: ["SERVICE", "PAYMENT"] })
  name: "SERVICE" | "PAYMENT";

  @ManyToOne(() => Organizations, (organizations) => organizations.roles, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(() => Memberships, (memberships) => memberships.roles, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "membership_id", referencedColumnName: "id" }])
  membership: Memberships;

  @RelationId((roles: Roles) => roles.organization)
  organizationId: number;

  @RelationId((roles: Roles) => roles.membership)
  membershipId: number;
}
