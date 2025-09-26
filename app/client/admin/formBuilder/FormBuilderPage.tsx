import { Switch } from "~/components/ui/switch";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SaveDialog } from "./SaveDialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { AppFormMetadata } from "~/models/integration/types";
import { FormPreview } from "./FormPreview";
import { FormSectionList } from "./FormSectionList";

const DND_SECTION_TYPE = "SECTION";

interface FormBuilderPageProps {
  appId: string;
  initialMetadata: AppFormMetadata;
  onSave: (payload: {
    appId: string;
    meta: AppFormMetadata;
    isActive: boolean;
  }) => void;
  isSaving: boolean;
  saveDialog: { open: boolean; title: string; message: string };
  onCloseDialog: () => void;
  isRunning: boolean;
}

export default function FormBuilderPage(props: FormBuilderPageProps) {
  const {
    appId,
    initialMetadata,
    onSave,
    isSaving,
    saveDialog,
    onCloseDialog,
    isRunning,
  } = props;

  const [meta, setMeta] = useState<AppFormMetadata>(initialMetadata);
  const [isActive, setIsActive] = useState(isRunning);

  const [currentSection, setCurrentSection] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<string>("");

  const updateMeta = (updater: (draft: AppFormMetadata) => void) => {
    const current = JSON.parse(
      JSON.stringify(meta),
    ) as AppFormMetadata;
    updater(current);
    setMeta(current);
    if (current.sections.length === 0) {
      setCurrentSection(0);
    } else if (currentSection < 1) {
      setCurrentSection(1);
    } else if (currentSection > current.sections.length) {
      setCurrentSection(current.sections.length);
    }
  };

  const handleSave = () => {
    onSave({ appId, meta, isActive });
  };

  return (
    <div className="h-screen w-screen">
      <Card className="flex h-full w-full flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Form Builder</CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {isActive ? "Active" : "Deactive"}
              </span>
              <Switch
                id="is-active-switch"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="px-6">
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <DndProvider backend={HTML5Backend}>
            <div className="flex h-full gap-4">
              {/* Left: Metadata Form */}
              <div className="flex h-full w-full max-w-xl flex-col overflow-hidden pr-2">
                <div className="flex-1 overflow-y-auto">
                  <FormSectionList
                    meta={meta}
                    withMeta={(updater) => updateMeta(updater)}
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                    dndType={DND_SECTION_TYPE}
                  />
                </div>
              </div>

              {/* Right: Preview */}
              <div className="flex flex-1 items-center justify-center overflow-auto">
                <FormPreview
                  meta={meta}
                  currentSection={currentSection}
                  selectedItem={selectedItem}
                  onSelectedItemChange={setSelectedItem}
                  onSectionChange={setCurrentSection}
                />
              </div>
            </div>
          </DndProvider>
        </CardContent>
      </Card>

      {/* Save Dialog */}
      <SaveDialog
        open={saveDialog.open}
        title={saveDialog.title}
        message={saveDialog.message}
        onClose={onCloseDialog}
      />
    </div>
  );
}
