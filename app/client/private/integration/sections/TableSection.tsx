import { CenteredSection } from '~/components/ui/centered-section'
import { LoadingCard } from '~/components/ui/loading-card'
import { LoaderCircleIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { useWorkflowExecution } from '~/hooks/use-workflow-execution'
import { setSectionResult } from '~/models/integration/SectionResultManager'
import { useEffect } from 'react'
import type { SelectedMembers } from '~/models/integration/types'


interface TableSectionProps {
  title: string
  workflow: any
  onSelectedMembersChange: (v: SelectedMembers[]) => void
  selectedMembers: SelectedMembers[]
  onNext: (rows: any[]) => void
  onPrevious?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export function TableSection({ title, workflow, onSelectedMembersChange, selectedMembers, onNext, onPrevious, hasPrevious, hasNext }: TableSectionProps) {
  const { loading, error, parsed, run } = useWorkflowExecution(workflow)

  useEffect(() => {
    if (!Array.isArray(parsed)) return
    onSelectedMembersChange(parsed)
    setSectionResult('table', { result: parsed })
  }, [parsed])

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      {(!Array.isArray(parsed) || parsed.length === 0) ? (
        <CenteredSection className="space-y-4">
          <LoadingCard 
            icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />} 
            message={loading ? '멤버 수집 중...' : (error || '멤버 수집 준비됨')} 
          />
          <div className="flex justify-end w-full">
            <Button onClick={() => run()} disabled={loading} variant="outline" className="px-6 py-2">데이터 수집</Button>
          </div>
        </CenteredSection>
      ) : (
        <div>
          <div className="mt-4 border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>가입일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedMembers.map((member: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="text-sm">{member.email ?? ''}</TableCell>
                    <TableCell className="text-sm">{member.status ?? ''}</TableCell>
                    <TableCell className="text-sm">{member.joinDate ?? 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <div className="flex justify-between pt-2">
        <div>
          {hasPrevious && (
            <Button onClick={onPrevious} variant="outline" className="px-6 py-2">이전</Button>
          )}
        </div>
        <div>
          {hasNext && (
            <Button className="px-8 py-2" onClick={() => { setSectionResult('table', { result: selectedMembers }); onNext(selectedMembers) }} disabled={!selectedMembers.length}>다음</Button>
          )}
        </div>
      </div>
    </div>
  )
}



