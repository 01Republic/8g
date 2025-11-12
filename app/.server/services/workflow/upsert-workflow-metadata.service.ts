import type { WorkflowType } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import { initializeDatabase } from "~/.server/db";
import type { FormWorkflow } from "~/models/workflow/types";

interface UpsertWorkflowMetadataPayload {
  workflowId?: number;
  description: string;
  meta: FormWorkflow;
  type?: WorkflowType;
}

export async function upsertWorkflowMetadata(
  {
    workflowId,
    description,
    meta,
    type = "WORKFLOW",
  }: UpsertWorkflowMetadataPayload,
  token?: string,
) {
  void token;

  await initializeDatabase();

  const repository = IntegrationAppWorkflowMetadata.getRepository();

  const entity = repository.create({
    id: workflowId,
    description,
    meta,
    type,
  });

  return repository.save(entity);
}
