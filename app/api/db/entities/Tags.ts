import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Subscriptions } from "./Subscriptions";
import { Organizations } from "./Organizations";
import { Teams } from "./Teams";

@Index("IDX_d90243459a697eadb8ad56e909", ["name"], { unique: true })
@Entity("tags")
export class Tags {
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

  @Column("enum", {
    name: "group",
    enum: ["TEAM", "USER", "PRODUCT", "RECURRING_TYPE", "BILLING_CYCLE"],
  })
  group: "TEAM" | "USER" | "PRODUCT" | "RECURRING_TYPE" | "BILLING_CYCLE";

  @Column("int", { name: "depth", default: () => "'0'" })
  depth: number;

  @Column("tinyint", { name: "is_featured", default: () => "'1'" })
  isFeatured: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

  @OneToMany(
    () => Subscriptions,
    (subscriptions) => subscriptions.recurringTypeTag
  )
  subscriptions: Subscriptions[];

  @OneToMany(
    () => Subscriptions,
    (subscriptions) => subscriptions.billingCycleTag
  )
  subscriptions2: Subscriptions[];

  @ManyToOne(() => Organizations, (organizations) => organizations.tags, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(() => Tags, (tags) => tags.tags, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "parent_tag_id", referencedColumnName: "id" }])
  parentTag: Tags;

  @OneToMany(() => Tags, (tags) => tags.parentTag)
  tags: Tags[];

  @ManyToMany(() => Teams, (teams) => teams.tags)
  teams: Teams[];
}
