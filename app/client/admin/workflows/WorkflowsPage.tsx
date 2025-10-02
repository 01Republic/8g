import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { WorkflowsTable } from "./WorkflowsTable";
import type { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";

interface WorkflowsPageProps {
  workflows: IntegrationAppWorkflowMetadata[];
  deleteWorkflows: (workflowId: number) => void;
}

export default function WorkflowsPage({ workflows, deleteWorkflows }: WorkflowsPageProps) {
  return (
    <div className="h-full w-full p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <Link to="/workflow-builder">
            <Button>+ 새 워크플로우</Button>
          </Link>
        </div>
        <WorkflowsTable workflows={workflows} deleteWorkflows={deleteWorkflows} />
      </div>
    </div>
  );
}
