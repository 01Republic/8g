import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("FK_e83bdc46013bbc2b1818a84ba58", ["accountId"], {})
@Index("IDX_415cfd641612bcfeb16459b5cc", ["workspaceId", "accountId"], {
  unique: true,
})
@Entity("workspace_roles")
export class WorkspaceRoles {
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

  @Column("int", { name: "workspace_id" })
  workspaceId: number;

  @Column("int", { name: "account_id" })
  accountId: number;

  @Column("enum", {
    name: "role",
    enum: ["OWNER", "ADMIN", "MEMBER", "INVITED"],
    default: () => "'OWNER'",
  })
  role: "OWNER" | "ADMIN" | "MEMBER" | "INVITED";
}
