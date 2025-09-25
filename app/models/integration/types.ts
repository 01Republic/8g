import type { WorkflowStep } from "8g-extension"

export type FormWorkflow = {
    version: string
    start: string
    steps: WorkflowStep[]
    parser: (result: any) => any
    targetUrl: string
  }
  
  export type SelectBoxSectionSchema = {
    type: 'select-box'
    title: string
    placeholder: string
    workflow: FormWorkflow
  }
  
  export type TableSectionSchema = {
    type: 'table'
    title: string
    workflow: FormWorkflow
  }
  
  export type CheckboxSectionSchema = {
    type: 'checkbox'
    title: string
    placeholder: string
    loadingMessage: string
    errorMessage: string
    successMessage: string
    workflow: FormWorkflow
  }
  
  export type InitialCheckSectionSchema = {
    type: 'initial-check'
    title: string
  }
  
  export type CompletionSectionSchema = {
    type: 'completion'
    title: string
  }
  
  export type FormSectionSchema =
    | SelectBoxSectionSchema
    | TableSectionSchema
    | CheckboxSectionSchema
    | InitialCheckSectionSchema
    | CompletionSectionSchema
  
  export type AppFormSectionMeta = {
    id: string
    uiSchema: FormSectionSchema
  }
  
  export type IntegrationAppFormMetadata = {
    sections: AppFormSectionMeta[]
  }
  
  
export type Product = {
    id: number;
    nameKo: string;
    nameEn: string;
    tagline: string | null;
    image: string;
    productTags: Array<{
      tag: {
        name: string;
      };
    }>;
  }

  export type SelectedWorkspace = {
    elementId: string
    elementText: string
  }

  export type SelectedMembers = {
    email: string
    status: string
    joinDate: string
  }