import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import type { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";

interface WorkflowsTableProps {
  workflows: IntegrationAppWorkflowMetadata[];
  deleteWorkflows: (workflowId: number) => void;
}

const formatDate = (date: Date | null) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const WorkflowsTable = (props: WorkflowsTableProps) => {
  const { workflows, deleteWorkflows } = props;

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-900">ID</TableHead>
            <TableHead className="font-semibold text-gray-900">
              설명
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Steps 수
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              수정일
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                워크플로우가 없습니다. 새로운 워크플로우를 만들어보세요!
              </TableCell>
            </TableRow>
          ) : (
            workflows.map((workflow) => (
              <TableRow key={workflow.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">#{workflow.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{workflow.description}</div>
                </TableCell>
                <TableCell>
                  {workflow.meta?.steps?.length || 0} steps
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(workflow.updatedAt || workflow.createdAt || null)}
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/workflow-builder/${workflow.id}`}>
                    <Button variant="outline" size="sm">
                      수정
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => deleteWorkflows(workflow.id)}>
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
