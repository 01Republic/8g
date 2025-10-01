import { initializeDatabase } from "../db";
import { IntegrationAppWorkflowMetadata } from "../db/entities/IntegrationAppWorkflowMetadata";

export async function deleteWorkflows(workflowId: number) {
  await initializeDatabase();

  await IntegrationAppWorkflowMetadata.delete(workflowId);
}