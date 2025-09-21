import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import type { Dispatch, SetStateAction } from "react"

import {
    Stepper,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperSeparator,
    StepperTrigger,
  } from '~/components/ui/stepper';
  import { Check, LoaderCircleIcon } from 'lucide-react';

import { StepBuilderFactory, type IntegrationService } from '../apps/StepBuilderFactory'

// Reusable fade transition wrapper (mounts only current content)
function FadeStep({ children }: { children: React.ReactNode }) {
  return (
    <div className="transition-opacity duration-300 opacity-100">
      {children}
    </div>
  )
}

interface IntegartionAppModalProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
    service: IntegrationService
    organizationId: number
    productId: number
}

export function IntegartionAppModal({
    open, 
    setOpen,
    service,
    organizationId,
    productId
}: IntegartionAppModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string>("");
  
  const stepBuilder = StepBuilderFactory.create(service);
  const stepCount = stepBuilder.getStepCount();
  const loadingStates = stepBuilder.getLoadingStates();
  
  const stepProps = {
    currentStep,
    selectedItem,
    onSelectedItemChange: setSelectedItem,
    onStepChange: setCurrentStep,
    onModalClose: () => setOpen(false),
    organizationId,
    productId
  };
  
  const steps = stepBuilder.buildSteps(stepProps);

  useEffect(() => {
    if (open) {
      setCurrentStep(1);
    }
  }, [open]);


  const stepNumbers = Array.from({ length: stepCount }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-4xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>SaaS 연동 설정</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-8 min-h-[500px]">
          {/* Left Side - Vertical Stepper */}
          <div className="w-16 flex justify-center items-center">
            <Stepper
              className="flex flex-col items-center justify-center"
              value={currentStep}
              orientation="vertical"
              indicators={{
                completed: <Check className="size-4" />,
                loading: <LoaderCircleIcon className="size-4 animate-spin" />,
              }}
            >
              <StepperNav>
                {stepNumbers.map((step) => (
                  <StepperItem key={step} step={step} loading={loadingStates[step] || false}>
                    <StepperTrigger>
                      <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-gray-500">
                        {step}
                      </StepperIndicator>
                    </StepperTrigger>
                    {stepNumbers.length > step && <StepperSeparator className="group-data-[state=completed]/step:bg-green-500" />}
                  </StepperItem>
                ))}
              </StepperNav>
            </Stepper>
          </div>

          {/* Right Side - Content View */}
          <div className="flex-1 relative px-8">
            <FadeStep key={currentStep}>
              <div className="min-h-[420px] flex items-center">{steps[currentStep - 1]}</div>
            </FadeStep>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

  