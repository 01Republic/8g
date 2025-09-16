import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("IDX_32f6b5207baa3aa63cfb987c28", ["teamId"], {})
@Index("IDX_b6f2105c98d4a42111fd40463d", ["creditCardId"], {})
@Index("IDX_bad2ed2399109276cdb9fbea21", ["teamId", "creditCardId"], {
  unique: true,
})
@Entity("team_credit_cards")
export class TeamCreditCards extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "credit_card_id" })
  creditCardId: number;

  @Column("int", { name: "team_id" })
  teamId: number;

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
}
