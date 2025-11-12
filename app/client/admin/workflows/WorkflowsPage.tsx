import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { WorkflowsTable } from "./WorkflowsTable";
import type { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import type { PaginationMetaData } from "~/.server/dto/pagination-meta-data.dto";

export interface WorkflowsPageProps {
  workflows: IntegrationAppWorkflowMetadata[];
  pagination: PaginationMetaData;
  deleteWorkflows: (workflowId: number) => void;
}

export default function WorkflowsPage({
  workflows,
  pagination,
  deleteWorkflows,
}: WorkflowsPageProps) {
  return (
    <div className="h-full w-full p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <Link to="/workflow-builder">
            <Button>+ 새 워크플로우</Button>
          </Link>
        </div>
        <WorkflowsTable
          workflows={workflows}
          pagination={pagination}
          deleteWorkflows={deleteWorkflows}
        />
      </div>
    </div>
  );
}
