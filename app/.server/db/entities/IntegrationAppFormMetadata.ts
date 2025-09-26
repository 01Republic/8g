import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { AppFormMetadata } from "~/models/integration/types";

/*
CREATE TABLE IF NOT EXISTS payplo_staging.integration_app_form_metadata (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  meta JSON NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  UNIQUE KEY uq_integration_app_form_metadata_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/
@Entity("integration_app_form_metadata")
export class IntegrationAppFormMetadata extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column({ type: "int", name: "product_id", unique: true })
  productId: number;

  @Column({ type: "json", name: "meta" })
  meta: AppFormMetadata;

  @Column({ type: "boolean", name: "is_active", default: false })
  isActive: boolean;
}
