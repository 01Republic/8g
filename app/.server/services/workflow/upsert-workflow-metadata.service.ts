import { initializeDatabase } from "~/.server/db";
import { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import type { FormWorkflow } from "~/models/integration/types";

interface UpsertWorkflowMetadataPayload {
  workflowId?: number;
  description: string;
  meta: FormWorkflow;
}

export async function upsertWorkflowMetadata({
  workflowId,
  description,
  meta,
}: UpsertWorkflowMetadataPayload) {
  await initializeDatabase();

  if (!workflowId) {
    await IntegrationAppWorkflowMetadata.save({
      description,
      meta,
    });
  }

  const existing = await IntegrationAppWorkflowMetadata.findOne({
    where: { id: workflowId },
  });

  if (existing) {
    await IntegrationAppWorkflowMetadata.update(
      { id: workflowId },
      { meta, description },
    );
  }
}
