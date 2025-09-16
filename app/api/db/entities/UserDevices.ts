import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("IDX_0b131182935b3fd40d565dd7ed", ["userId", "fcmToken"], {
  unique: true,
})
@Index("IDX_da93e83ed00a0f60dd230a1d0b", ["fcmToken"], {})
@Index("IDX_f426f5bd6b9e082b584e0fbd5e", ["userId"], {})
@Entity("user-devices")
export class UserDevices {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("tinyint", { name: "isMobile", default: () => "'0'" })
  isMobile: number;

  @Column("varchar", { name: "fcmToken", length: 255 })
  fcmToken: string;

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

  @ManyToOne(() => Users, (users) => users.userDevices, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
