import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Teams } from "./Teams";

@Index("IDX_126d4a0c2656b1f7d35964fe64", ["teamMemberId"], {})
@Index("IDX_3f90385dfb88acd362ae522a89", ["teamId", "teamMemberId"], {
  unique: true,
})
@Index("IDX_b917b8603c6d5c526fcdb2009d", ["teamId"], {})
@Entity("team_memberships")
export class TeamMemberships {
  @Column("int", { primary: true, name: "team_id" })
  teamId: number;

  @Column("int", { primary: true, name: "team_member_id" })
  teamMemberId: number;

  @ManyToOne(() => Teams, (teams) => teams.teamMemberships, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "team_id", referencedColumnName: "id" }])
  team: Teams;
}
