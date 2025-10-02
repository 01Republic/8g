import { initializeDatabase } from "~/.server/db";
import { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";

export async function findWorkflowMetadata(workflowId: number) {
  await initializeDatabase();
  
  const workflow = await IntegrationAppWorkflowMetadata.findOne({
    where: { id: workflowId },
  });

  return workflow;
}
