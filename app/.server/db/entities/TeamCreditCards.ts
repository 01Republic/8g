import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Teams } from "./Teams";
import { CreditCard } from "./CreditCard";

@Index("IDX_bad2ed2399109276cdb9fbea21", ["creditCardId", "teamId"], {
  unique: true,
})
@Index("IDX_b6f2105c98d4a42111fd40463d", ["creditCardId"], {})
@Index("IDX_32f6b5207baa3aa63cfb987c28", ["teamId"], {})
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

  @ManyToOne(() => Teams, (teams) => teams.teamCreditCards, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "team_id", referencedColumnName: "id" }])
  team: Teams;

  @ManyToOne(() => CreditCard, (creditCard) => creditCard.teamCreditCards, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "credit_card_id", referencedColumnName: "id" }])
  creditCard: CreditCard;

  @RelationId((teamCreditCards: TeamCreditCards) => teamCreditCards.team)
  teamId2: number;

  @RelationId((teamCreditCards: TeamCreditCards) => teamCreditCards.creditCard)
  creditCardId2: number;
}
