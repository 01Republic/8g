import { Link, useNavigate, useSearchParams } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import type { PaginationMetaData } from "~/.server/dto/pagination-meta-data.dto";

interface WorkflowsTableProps {
  workflows: IntegrationAppWorkflowMetadata[];
  pagination: PaginationMetaData;
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
  const { workflows, pagination, deleteWorkflows } = props;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentPage = pagination.currentPage;
  const totalPages = pagination.totalPage;
  const itemsPerPage = pagination.itemsPerPage;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    navigate(`/?${params.toString()}`);
  };

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("itemsPerPage", newItemsPerPage);
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* 필터 영역 */}
      <div className="flex items-center justify-end bg-white p-4 rounded-lg border">
        <div className="text-sm text-gray-600">
          {pagination.currentItemCount}개 / 전체 {pagination.totalItemCount}개
        </div>
      </div>

      {/* 테이블 */}
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
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  워크플로우가 없습니다. 새로운 워크플로우를 만들어보세요!
                </TableCell>
              </TableRow>
            ) : (
              workflows.map((workflow) => {
                return (
                  <TableRow key={workflow.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      #{workflow.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{workflow.description}</div>
                    </TableCell>
                    <TableCell>
                      {workflow.meta?.steps?.length || 0} steps
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(
                        workflow.updatedAt || workflow.createdAt || null,
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link to={`/workflow-builder/${workflow.id}`}>
                        <Button variant="outline" size="sm">
                          수정
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteWorkflows(workflow.id)}
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination 영역 */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">페이지당 항목:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-600">
            전체 {pagination.totalItemCount}개 중{" "}
            {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, pagination.totalItemCount)}개
            표시
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            «
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-9"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </Button>
        </div>
      </div>
    </div>
  );
};
