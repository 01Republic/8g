import type { ReactNode } from 'react'
import type { IntegrationAppFormMetadata } from '~/models/integration/types'
import { buildSections } from './SectionsBuilder'
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTrigger,
} from '~/components/ui/stepper'
import { Check, LoaderCircleIcon } from 'lucide-react'
import type { SelectedWorkspace } from '~/models/integration/types'
import type { SelectedMembers } from '~/models/integration/types'

export interface FormComponentProps {
  currentSection: number
  selectedWorkspace: SelectedWorkspace | null
  selectedMembers: SelectedMembers[]
  onSelectedWorkspaceChange: (value: SelectedWorkspace) => void
  onSelectedMembersChange: (value: SelectedMembers[]) => void
  onSectionChange: (section: number) => void
  onModalClose: () => void
  productId: number
  onSubmit: () => void
}

// Options to customize builder behavior (e.g., preview mode in form-builder)
type BuilderOptions = {
  meta: IntegrationAppFormMetadata
}

// No per-app hooks; everything is metadata-driven now
export function DynamicFormBuilder(options: BuilderOptions) {
  const { meta } = options

  const renderSections = (props: FormComponentProps): ReactNode[] => buildSections(meta, props)

  return {
    buildStepper: (args: { props: FormComponentProps; loadingStates?: Record<number, boolean> }) => {
      const sectionCount = meta.sections.length
      const sectionNumbers = Array.from({ length: sectionCount }, (_, i) => i + 1)
      const loadingStates = args.loadingStates || Object.fromEntries(sectionNumbers.map((n) => [n, false]))
      const sections = renderSections(args.props)

      const stepperSection = (
        <Stepper
          className="flex flex-col items-center justify-center"
          value={args.props.currentSection}
          orientation="vertical"
          indicators={{
            completed: <Check className="size-4" />,
            loading: <LoaderCircleIcon className="size-4 animate-spin" />,
          }}
        >
          <StepperNav>
            {sectionNumbers.map((step) => (
              <StepperItem key={step} step={step} loading={loadingStates[step] || false}>
                <StepperTrigger onClick={() => {}}>
                  <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-black data-[state=active]:bg-primary data-[state=active]:text-black data-[state=inactive]:text-gray-500">
                    {step}
                  </StepperIndicator>
                </StepperTrigger>
                {sectionNumbers.length > step && (
                  <StepperSeparator className="group-data-[state=completed]/step:bg-green-500" />
                )}
              </StepperItem>
            ))}
          </StepperNav>
        </Stepper>
      )

      const stepSection = (
        <div className="min-h-[420px] flex items-center">{sections[args.props.currentSection - 1]}</div>
      )

      return { stepperSection, stepSection }
    },
    
    buildSections: (props: FormComponentProps) => renderSections(props),
  }
}


