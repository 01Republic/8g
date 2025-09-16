import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("phone_auth_sessions")
export class PhoneAuthSessions {
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

  @Column("varchar", { name: "phoneNumber", length: 255 })
  phoneNumber: string;

  @Column("varchar", { name: "code", length: 255 })
  code: string;

  @Column("datetime", { name: "confirmedAt", nullable: true })
  confirmedAt: Date | null;
}
