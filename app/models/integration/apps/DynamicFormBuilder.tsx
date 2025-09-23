import type { ReactNode } from 'react'
import type { IntegrationAppFormMetadata, SelectBoxSectionSchema, TableSectionSchema, CheckboxSectionSchema } from './IntegrationAppFormMetadata'
import { buildSections } from './components/SectionsBuilder'
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTrigger,
} from '~/components/ui/stepper'
import { Check, LoaderCircleIcon } from 'lucide-react'

export interface FormComponentProps {
  currentSection: number
  selectedItem: string
  onSelectedItemChange: (value: string) => void
  onSectionChange: (section: number) => void
  onModalClose: () => void
  productId: number
}

// Options to customize builder behavior (e.g., preview mode in form-builder)
type BuilderOptions = {
  meta: IntegrationAppFormMetadata,
  onSubmit: (payload: { workspace?: any; members?: any[]; productId: number }) => Promise<void>
}

// No per-app hooks; everything is metadata-driven now
export function DynamicFormBuilder(options: BuilderOptions) {
  const { meta, onSubmit } = options

  const renderSections = (props: FormComponentProps): ReactNode[] => buildSections(meta, props, onSubmit)

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
                <StepperTrigger onClick={() => args.props.onSectionChange(step)}>
                  <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-gray-500">
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


