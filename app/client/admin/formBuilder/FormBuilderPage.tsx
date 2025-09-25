import { Switch } from "~/components/ui/switch"
import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import SaveDialog from "./SaveDialog"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { type IntegrationAppFormMetadata } from "~/models/integration/apps/IntegrationAppFormMetadata"
import FormPreview from "./FormPreview"
import FormSectionList from "./FormSectionList"

const DND_SECTION_TYPE = 'SECTION'

interface FormBuilderPageProps {
    appId: string
    initialMetadata: IntegrationAppFormMetadata
    onSave: (payload: { appId: string; meta: IntegrationAppFormMetadata; isActive: boolean }) => void
    isSaving: boolean
    saveDialog: { open: boolean; title: string; message: string }
    onCloseDialog: () => void
}

export default function FormBuilderPage( props: FormBuilderPageProps ) {
    const { appId, initialMetadata, onSave, isSaving, saveDialog, onCloseDialog } = props
    
    const [meta, setMeta] = useState<IntegrationAppFormMetadata>(initialMetadata)
    const [isActive, setIsActive] = useState(false)
    
    const [currentSection, setCurrentSection] = useState<number>(0)
    const [selectedItem, setSelectedItem] = useState<string>('')
    
  
    const updateMeta = (updater: (draft: IntegrationAppFormMetadata) => void) => {
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
  
    const handleSave = () => {
      onSave({ appId, meta, isActive })
    }
  
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
                <FormSectionList  
                  meta={meta}
                  withMeta={(updater) => updateMeta(updater)}
                  currentSection={currentSection}
                  setCurrentSection={setCurrentSection}
                  dndType={DND_SECTION_TYPE}
                />
  
                {/* Right: Preview */}
                <FormPreview
                  meta={meta}
                  currentSection={currentSection}
                  selectedItem={selectedItem}
                  onSelectedItemChange={setSelectedItem}
                  onSectionChange={setCurrentSection}
                />
              </div>
            </DndProvider>
          </CardContent>
        </Card>
  
        {/* Save Dialog */}
        <SaveDialog open={saveDialog.open} title={saveDialog.title} message={saveDialog.message} onClose={onCloseDialog} />
      </div>
    )
}