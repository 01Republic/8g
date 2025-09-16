import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organizations } from "./Organizations";
import { GoogleTokenData } from "./GoogleTokenData";

@Entity("google_sync_histories")
export class GoogleSyncHistories {
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
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "organization_id", referencedColumnName: "id" }])
  organization: Organizations;

  @ManyToOne(
    () => GoogleTokenData,
    (googleTokenData) => googleTokenData.googleSyncHistories,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "google_token_data_id", referencedColumnName: "id" }])
  googleTokenData: GoogleTokenData;

  @OneToMany(
    () => Organizations,
    (organizations) => organizations.lastGoogleSyncHistory
  )
  organizations: Organizations[];
}
