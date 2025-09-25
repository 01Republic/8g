import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { IntegrationAppFormMetadata } from '~/models/integration/apps/IntegrationAppFormMetadata'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Switch } from '~/components/ui/switch'
import { SectionTypePropsMapper } from '~/models/integration/apps/IntegrationAppFormMetadata'
import { DynamicFormBuilder, type FormComponentProps } from '~/models/integration/apps/DynamicFormBuilder'
import { Separator } from '~/components/ui/separator'
import SectionConfigBuilder from '~/models/integration/apps/components/SectionConfigBuilder'
import Reorderable from '~/components/Reorderable'
import type { Route } from './+types/form-builder'
import { useFetcher } from 'react-router'
import { IntegrationAppFormMetadata as IntegrationAppFormMetadataEntity } from '~/.server/db/entities/IntegrationAppFormMetadata'
import { initializeDatabase } from '~/.server/db'

const DND_SECTION_TYPE = 'SECTION'

export async function loader({ params }: Route.LoaderArgs) {
  await initializeDatabase()
  const integrationAppFormMetadata = await IntegrationAppFormMetadataEntity.findOne({ where: { productId: parseInt(params.appId) } })

  if (!integrationAppFormMetadata) {
    return { appId: params.appId, meta: { sections: [] } }
  }
  return { appId: params.appId, meta: integrationAppFormMetadata.meta as unknown as IntegrationAppFormMetadata }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const appId = formData.get('appId') as string
  const meta = formData.get('meta') as string
  const isActiveStr = formData.get('isActive') as string | null
  const isActive = isActiveStr === 'true'

  await initializeDatabase()
  const isUpdate = await IntegrationAppFormMetadataEntity.findOne({ where: { productId: parseInt(appId) } })
  if (isUpdate) {
    await IntegrationAppFormMetadataEntity.update({ productId: parseInt(appId) }, { meta: JSON.parse(meta), isActive })
  } else {
    await IntegrationAppFormMetadataEntity.save({ productId: parseInt(appId), meta: JSON.parse(meta), isActive })
  }
  
  return {
    message: 'Success',
  }
}

export default function FormBuilder(
  { loaderData }: Route.ComponentProps
) {
  const { appId, meta: initialMeta } = loaderData
  const [meta, setMeta] = useState<IntegrationAppFormMetadata>(initialMeta as unknown as IntegrationAppFormMetadata)
  const [currentSection, setCurrentSection] = useState<number>(0)
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [isActive, setIsActive] = useState(false)
  const fetcher = useFetcher()
  const isSaving = fetcher.state !== 'idle'
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogMessage, setDialogMessage] = useState('')
  const [pendingSave, setPendingSave] = useState(false)

  const withMeta = (updater: (draft: IntegrationAppFormMetadata) => void) => {
    const current = JSON.parse(JSON.stringify(meta)) as IntegrationAppFormMetadata
    updater(current)
    setMeta(current)
    if (current.sections.length === 0) {
      setCurrentSection(0)
    } else if (currentSection < 1) {
      setCurrentSection(1)
    } else if (currentSection > current.sections.length) {
      setCurrentSection(current.sections.length)
    }
  }

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const selectedId = currentSection > 0 ? meta.sections[currentSection - 1]?.id : undefined
    withMeta((draft) => {
      const dragged = draft.sections[dragIndex]
      draft.sections.splice(dragIndex, 1)
      draft.sections.splice(hoverIndex, 0, dragged)
      if (selectedId) {
        const newIndex = draft.sections.findIndex((s) => s.id === selectedId)
        if (newIndex >= 0) setCurrentSection(newIndex + 1)
      }
    })
  }
  const sectionProps = {
    currentSection,
    selectedItem,
    onSelectedItemChange: setSelectedItem,
    onSectionChange: setCurrentSection,
    onModalClose: () => {},
    productId: 0,
    onSubmit: () => Promise.resolve(),
    selectedWorkspace: null,
    selectedMembers: [],
    onSelectedWorkspaceChange: () => {},
    onSelectedMembersChange: () => {}
  } as FormComponentProps
  const hasSections = meta.sections.length > 0

  const formBuilder = DynamicFormBuilder({ meta })
  const preview = hasSections ? formBuilder.buildStepper({ props: sectionProps }) : null

  const handleSave = () => {
    setPendingSave(true)
    const formData = new FormData()
    formData.append('appId', appId)
    formData.append('meta', JSON.stringify(meta))
    formData.append('isActive', String(isActive))
    fetcher.submit(formData, { method: 'POST' })
  }

  useEffect(() => {
    if (!pendingSave) return
    if (fetcher.state === 'idle') {
      const data = fetcher.data as any
      const hasError = data && typeof data === 'object' && 'error' in data
      setDialogTitle(hasError ? '저장 실패' : '저장 완료')
      setDialogMessage(
        hasError
          ? (data?.error as string) || '저장 중 오류가 발생했습니다.'
          : '메타데이터가 저장되었습니다.'
      )
      setDialogOpen(true)
      setPendingSave(false)
    }
  }, [fetcher.state, fetcher.data, pendingSave])

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Form Builder</CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{isActive ? 'Active' : 'Deactive'}</span>
              <Switch id="is-active-switch" checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="px-6">
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <DndProvider backend={HTML5Backend}>
            <div className="flex gap-8">
              {/* Left: Metadata Form */}
              <div className="w-full max-w-xl space-y-6">
                <div className="flex items-center gap-2">
                  <Label>섹션 추가</Label>
                  <Select onValueChange={(v) => {
                    const nextIndex = meta.sections.length + 1
                    withMeta((draft) => {
                      const builder = SectionTypePropsMapper[v as keyof typeof SectionTypePropsMapper]
                      if (!builder) return
                      draft.sections.push({ id: `section-${draft.sections.length + 1}`, uiSchema: builder() })
                    })
                    setCurrentSection(nextIndex)
                  }}>
                    <SelectTrigger className="w-[220px]"><SelectValue placeholder="섹션 타입 선택" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(SectionTypePropsMapper).map(([type]) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  {meta.sections.map((section, index) => {
                    const sectionIndex = index + 1
                    const isActive = currentSection === sectionIndex
                    return (
                      <Reorderable
                        key={section.id}
                        index={index}
                        move={moveSection}
                        isActive={isActive}
                        onClick={() => setCurrentSection(sectionIndex)}
                        dndType={DND_SECTION_TYPE}
                      >
                        {SectionConfigBuilder({ section, sectionIndex, index, withMeta })}
                      </Reorderable>
                    )
                  })}
                </div>
              </div>

              {/* Right: Preview */}
              <div className="flex-1">
                <div className="w-full">
                  <div className="bg-background rounded-lg border p-6 shadow-lg w-full max-w-[90vw] sm:max-w-4xl lg:max-w-4xl">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2 text-center sm:text-left">
                        <div className="text-lg leading-none font-semibold">SaaS 연동 설정</div>
                      </div>
                      <div className="flex gap-8 min-h-[500px]">
                        <div className="w-16 flex justify-center items-center">
                          {preview?.stepperSection}
                        </div>
                        <div className="flex-1 relative px-8">
                          {preview?.stepSection}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DndProvider>
        </CardContent>
      </Card>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <AlertDialogAction onClick={() => setDialogOpen(false)}>확인</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}