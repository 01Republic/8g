import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("_exchange_currencies")
export class ExchangeCurrencies {
  @Column("varchar", { name: "currencyCode", length: 255 })
  currencyCode: string;

  @Column("float", { name: "dollarPrice", precision: 12, default: () => "'1'" })
  dollarPrice: number;

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

  @Column("date", { name: "exchangeAt" })
  exchangeAt: string;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;
}
