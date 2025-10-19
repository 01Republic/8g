import { initializeDatabase } from "~/.server/db";
import { IntegrationAppWorkflowMetadata, type WorkflowType } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import type { FormWorkflow } from "~/models/workflow/types";

interface UpsertWorkflowMetadataPayload {
  workflowId?: number;
  description: string;
  meta: FormWorkflow;
  type?: WorkflowType;
}

export async function upsertWorkflowMetadata({
  workflowId,
  description,
  meta,
  type = 'workflow',
}: UpsertWorkflowMetadataPayload) {
  await initializeDatabase();

  if (!workflowId) {
    await IntegrationAppWorkflowMetadata.save({
      description,
      meta,
      type,
    });
  }

  const existing = await IntegrationAppWorkflowMetadata.findOne({
    where: { id: workflowId },
  });

  if (existing) {
    await IntegrationAppWorkflowMetadata.update(
      { id: workflowId },
      { meta, description, type },
    );
  }
}
