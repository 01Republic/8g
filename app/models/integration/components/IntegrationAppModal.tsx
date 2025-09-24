import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import type { Dispatch, SetStateAction } from "react"
import { DynamicFormBuilder } from "../apps/DynamicFormBuilder";
import { type IntegrationAppFormMetadata } from "../apps/IntegrationAppFormMetadata";

interface IntegartionAppModalProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    onSubmit: (payload: { workspace: any; members: any[]; productId: number }) => void
    meta: IntegrationAppFormMetadata
    productId: number
}

export function IntegartionAppModal({
    open, 
    setOpen,
    onSubmit,
    meta,
    productId
}: IntegartionAppModalProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  
  const sectionProps = {
    currentSection,
    selectedWorkspace,
    onSelectedWorkspaceChange: setSelectedWorkspace,
    selectedMembers,
    onSelectedMembersChange: setSelectedMembers,
    onSectionChange: setCurrentSection,
    onModalClose: () => {
      setSelectedWorkspace(null);
      setSelectedMembers([]);
      setCurrentSection(0);
      setOpen(false)
    },
    productId
  };
  
  const formBuilder = DynamicFormBuilder({ meta, onSubmit: () => {
    onSubmit({ workspace: selectedWorkspace, members: selectedMembers, productId })
  } })
  const { stepperSection, stepSection } = formBuilder.buildStepper({ props: sectionProps })

  useEffect(() => {
    if (open) {
      setCurrentSection(1);
      setSelectedWorkspace(null);
      setSelectedMembers([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-4xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>SaaS 연동 설정</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-8 min-h-[500px]">
          {/* Left Side - Vertical Stepper */}
          <div className="w-16 flex justify-center items-center">
            {stepperSection}
          </div>

          {/* Right Side - Content View */}
          <div className="flex-1 relative px-8">
            {stepSection}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

  