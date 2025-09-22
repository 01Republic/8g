import { CenteredSection } from '~/components/ui/centered-section'
import { LoadingCard } from '~/components/ui/loading-card'
import { LoaderCircleIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { useWorkflowExecution } from '../../hooks/useWorkflowExecution'

interface TableStepProps {
  title: string
  workflow: any
  targetUrl?: string
  onConfirm: (rows: any[]) => void
  selectedWorkspaceLabel?: string
  ctx?: any
}

export function TableStep({ title, workflow, targetUrl, onConfirm, selectedWorkspaceLabel, ctx }: TableStepProps) {
  const resolvedUrl = targetUrl ?? (typeof workflow?.targetUrl === 'function' ? workflow.targetUrl(ctx) : workflow?.targetUrl)
  const { loading, error, parsed } = useWorkflowExecution(workflow, resolvedUrl)
  const rows: any[] = Array.isArray(parsed) ? parsed : []

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      <h3 className="text-lg font-semibold text-center">{title}</h3>
      {(!parsed || rows.length === 0) ? (
        <CenteredSection className="space-y-4">
          <LoadingCard 
            icon={<LoaderCircleIcon className="w-4 h-4 animate-spin" />} 
            message={loading ? '멤버 수집 중...' : (error || '멤버 수집 준비됨')} 
          />
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
                {rows.map((member: any, index: number) => (
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
          <div className="flex justify-end items-center pt-2">
            <Button className="px-8 py-2" onClick={() => onConfirm(rows)}>완료하기</Button>
          </div>
        </div>
      )}
    </div>
  )
}


