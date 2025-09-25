import { Label } from "~/components/ui/label"
import Reorderable from "~/components/Reorderable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import SectionConfigBuilder from "~/models/integration/apps/components/SectionConfigBuilder"
import { SectionTypePropsMapper, type IntegrationAppFormMetadata } from "~/models/integration/apps/IntegrationAppFormMetadata"

interface FormSectionListProps {
  meta: IntegrationAppFormMetadata
  withMeta: (updater: (draft: IntegrationAppFormMetadata) => void) => void
  currentSection: number
  setCurrentSection: (index: number) => void
  dndType: string
}

export default function FormSectionList(props: FormSectionListProps) {
  const { meta, withMeta: updateMeta, currentSection, setCurrentSection, dndType } = props

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const selectedId = currentSection > 0 ? meta.sections[currentSection - 1]?.id : undefined
    updateMeta((draft) => {
      const dragged = draft.sections[dragIndex]
      draft.sections.splice(dragIndex, 1)
      draft.sections.splice(hoverIndex, 0, dragged)
      if (selectedId) {
        const newIndex = draft.sections.findIndex((s) => s.id === selectedId)
        if (newIndex >= 0) setCurrentSection(newIndex + 1)
      }
    })
  }

  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="flex items-center gap-2">
        <Label>섹션 추가</Label>
        <Select onValueChange={(v) => {
          const nextIndex = meta.sections.length + 1
          updateMeta((draft) => {
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
              dndType={dndType}
            >
              {SectionConfigBuilder({ section, sectionIndex, index, withMeta: updateMeta })}
            </Reorderable>
          )
        })}
      </div>
    </div>
  )
}
