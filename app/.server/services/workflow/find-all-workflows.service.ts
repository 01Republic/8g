import { initializeDatabase } from "~/.server/db";
import { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";

export async function findAllWorkflows() {
  await initializeDatabase();

  const workflows = await IntegrationAppWorkflowMetadata.find({
    order: {
      id: "DESC", // 최신순
    },
  });

  return workflows;
}
