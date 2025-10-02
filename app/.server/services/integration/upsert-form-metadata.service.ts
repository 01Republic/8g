import { initializeDatabase } from "~/.server/db";
import { IntegrationAppFormMetadata } from "~/.server/db/entities/IntegrationAppFormMetadata";
import type { AppFormMetadata } from "~/models/integration/types";

export async function upsertFormMetadata(
  appId: string,
  meta: AppFormMetadata,
  isActive: boolean,
) {
  await initializeDatabase();

  const productId = parseInt(appId, 10);

  const existing = await IntegrationAppFormMetadata.findOne({
    where: { productId },
  });

  if (existing) {
    await IntegrationAppFormMetadata.update({ productId }, { meta, isActive });

    return;
  }

  await IntegrationAppFormMetadata.save({
    productId,
    meta: meta,
    isActive,
  });
}
