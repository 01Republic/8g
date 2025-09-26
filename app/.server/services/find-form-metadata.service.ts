import { initializeDatabase } from "../db";
import { IntegrationAppFormMetadata } from "../db/entities/IntegrationAppFormMetadata";

export async function findAllFormMetadata(appId: string) {
  await initializeDatabase();
  const integrationAppFormMetadata = await IntegrationAppFormMetadata.findOne({
    where: { productId: parseInt(appId) },
  });

  if (!integrationAppFormMetadata) {
    return {
      appId: appId,
      initialMeta: { sections: [] },
      isActive: false,
    };
  }

  return {
    appId: appId,
    initialMeta: integrationAppFormMetadata.meta,
    isActive: integrationAppFormMetadata.isActive,
  };
}
