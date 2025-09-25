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
import { Organizations } from "./Organizations";
import { GoogleTokenData } from "./GoogleTokenData";

@Entity("google_sync_histories")
export class GoogleSyncHistories extends BaseEntity {
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

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @ManyToOne(
    () => Organizations,
    (organizations) => organizations.googleSyncHistories,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(
    () => GoogleTokenData,
    (googleTokenData) => googleTokenData.googleSyncHistories,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" },
  )
  @JoinColumn([{ name: "google_token_data_id", referencedColumnName: "id" }])
  googleTokenData: GoogleTokenData;

  @OneToMany(
    () => Organizations,
    (organizations) => organizations.lastGoogleSyncHistory,
  )
  organizations: Organizations[];

  @RelationId(
    (googleSyncHistories: GoogleSyncHistories) =>
      googleSyncHistories.organization,
  )
  organizationId: number;

  @RelationId(
    (googleSyncHistories: GoogleSyncHistories) =>
      googleSyncHistories.googleTokenData,
  )
  googleTokenDataId: number;
}
