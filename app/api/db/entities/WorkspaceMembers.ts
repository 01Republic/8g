import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Workspaces } from "./Workspaces";
import { TeamMembers } from "./TeamMembers";

@Entity("workspace_members")
export class WorkspaceMembers {
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

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "role", nullable: true, length: 255 })
  role: string | null;

  @Column("varchar", { name: "link", nullable: true, length: 255 })
  link: string | null;

  @Column("text", { name: "profile_img_url", nullable: true })
  profileImgUrl: string | null;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.workspaceMembers, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "workspace_id", referencedColumnName: "id" }])
  workspace: Workspaces;

  @ManyToOne(() => TeamMembers, (teamMembers) => teamMembers.workspaceMembers, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "team_member_id", referencedColumnName: "id" }])
  teamMember: TeamMembers;
}
