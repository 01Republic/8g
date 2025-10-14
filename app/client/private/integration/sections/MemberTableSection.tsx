import { CenteredSection } from "~/components/ui/centered-section";
import { LoadingCard } from "~/components/ui/loading-card";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useWorkflowExecution } from "~/hooks/use-workflow-execution";
import { setSectionResult } from "~/models/integration/SectionResultManager";
import { useEffect, useMemo } from "react";
import type { SelectedMembers } from "~/models/integration/types";
import { IntegrationSectionContentBox } from "./IntegrationSectionContentBox";
import { generateVariablesFromSectionResults } from "~/models/integration/VariableGenerator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface MemberTableSectionProps {
  title: string;
  workflow: any;
  onSelectedMembersChange: (v: SelectedMembers[]) => void;
  selectedMembers: SelectedMembers[];
  onNext: (rows: any[]) => void;
  onPrevious?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export function MemberTableSection({
  title,
  workflow,
  onSelectedMembersChange,
  selectedMembers,
  onNext,
  onPrevious,
  hasPrevious,
  hasNext,
}: MemberTableSectionProps) {
  const variables = useMemo(() => {
    return generateVariablesFromSectionResults();
  }, []);

  const { loading, error, parsed, run } = useWorkflowExecution(
    workflow,
    variables,
  );

  useEffect(() => {
    if (!Array.isArray(parsed)) return;
    onSelectedMembersChange(parsed);
    setSectionResult("member-table", { result: parsed });
  }, [parsed]);

  return (
    <IntegrationSectionContentBox
      title={title}
      buttonText={
        !Array.isArray(parsed) || parsed.length === 0 ? "데이터 수집" : ""
      }
      onClick={run}
      isLoading={loading}
      hasPrevious={hasPrevious}
      onPrevious={onPrevious}
      hasNext={hasNext}
      onNext={() => {
        setSectionResult("member-table", { result: selectedMembers });
        onNext(selectedMembers);
      }}
      isNextDisabled={!selectedMembers.length}
    >
      {!Array.isArray(parsed) || parsed.length === 0 ? (
        <CenteredSection className="space-y-4">
          <LoadingCard
            icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />}
            message={loading ? "멤버 수집 중..." : error || "멤버 수집 준비됨"}
          />
        </CenteredSection>
      ) : (
        <section className="mt-4 border rounded-lg max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0">
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>프로필</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>가입일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedMembers.map((member: SelectedMembers, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="text-sm">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.profileImgUrl ?? ""} />
                      <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="text-sm">
                    {member.email ?? ""}
                  </TableCell>
                  <TableCell className="text-sm">{member.name ?? ""}</TableCell>
                  <TableCell className="text-sm">
                    {member.joinDate ?? "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </IntegrationSectionContentBox>
  );
}
