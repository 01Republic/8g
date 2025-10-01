import type { WorkflowStep } from "8g-extension";


export type FormWorkflow = {
  version: string;
  start: string;
  steps: WorkflowStep[];
  targetUrl?: string;
  parser?: {
    expression: string;
  };
  variables?: Record<string, any>;
};









export type WorkspaceSelectSectionSchema = {
  type: "workspace-select";
  title: string;
  placeholder: string;
  workflow: FormWorkflow;
  workflowId?: number;
};

export type MemberTableSectionSchema = {
  type: "member-table";
  title: string;
  workflow: FormWorkflow;
  workflowId?: number;
};

export type PermissionCheckSectionSchema = {
  type: "permission-check";
  title: string;
  placeholder: string;
  loadingMessage: string;
  errorMessage: string;
  successMessage: string;
  workflow: FormWorkflow;
  workflowId?: number;
};

export type InitialCheckSectionSchema = {
  type: "initial-check";
  title: string;
};

export type CompletionSectionSchema = {
  type: "completion";
  title: string;
};

export type FormSectionSchema =
  | WorkspaceSelectSectionSchema
  | MemberTableSectionSchema
  | PermissionCheckSectionSchema
  | InitialCheckSectionSchema
  | CompletionSectionSchema;

export type AppFormSectionMeta = {
  id: string;
  uiSchema: FormSectionSchema;
};

export type AppFormMetadata = {
  sections: AppFormSectionMeta[];
};

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
};

export type SelectedWorkspace = {
  elementId: string;
  elementText: string;
};

export type SelectedMembers = {
  email: string;
  status: string;
  joinDate: string;
};
