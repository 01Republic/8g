import { initializeDatabase } from "~/.server/db";
import { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";

export async function findWorkflowMetadata(
  workflowId: number,
  token?: string,
) {
  void token;

  await initializeDatabase();

  const workflow = await IntegrationAppWorkflowMetadata.findOne({
    where: { id: workflowId },
  });

  return workflow ?? null;
}

export async function findWorkflowMetadataByProductId(
  token?: string,
) {
  void token;

  await initializeDatabase();

  return IntegrationAppWorkflowMetadata.findOne({
    order: { id: "DESC" },
  });
}
