import type { ElementData, GetElementDataBlock, WorkflowStep } from "8g-extension"

export interface FormWorkflow {
  version: string
  start: string
  steps: WorkflowStep[]
  parser: (result: any) => any
  targetUrl: string
}

export type SelectBoxSectionSchema = {
  type: 'select-box'
  workflow: FormWorkflow
}

export type TableSectionSchema = {
  type: 'table'
  workflow: FormWorkflow
}

export type CheckboxSectionSchema = {
  type: 'checkbox'
  workflow: FormWorkflow
}

export type InitialCheckSectionSchema = {
  type: 'initial-check'
}

export type CompletionSectionSchema = {
  type: 'completion'
}

export type FormSectionSchema =
  | SelectBoxSectionSchema
  | TableSectionSchema
  | CheckboxSectionSchema
  | InitialCheckSectionSchema
  | CompletionSectionSchema

// Sections that require a workflow must always provide uiSchema with workflow
export type RequiredWorkflowSectionMeta = {
  id: string
  title: string
  uiSchema: SelectBoxSectionSchema | TableSectionSchema | CheckboxSectionSchema
}

// Sections without workflow can omit uiSchema entirely or provide minimal schema
export type OptionalWorkflowlessSectionMeta = {
  id: string
  title: string
  uiSchema?: InitialCheckSectionSchema | CompletionSectionSchema
}

export type AppFormSectionMeta = RequiredWorkflowSectionMeta | OptionalWorkflowlessSectionMeta

export interface IntegrationAppFormMetadata {
  sections: AppFormSectionMeta[]
}

export const slackMetadata: IntegrationAppFormMetadata = {
    sections: [
      { 
        id: 'initial-check',
        title: 'Extension 상태 확인',
        uiSchema: {
          type: 'initial-check',
        }
      },
      {
        id: 'select-box',
        title: '워크스페이스 선택',
        uiSchema: {
          type: 'select-box',
          workflow: {
            version: '1.0',
            start: 'collectWorkspaces',
            steps: [
              {
                id: 'collectWorkspaces',
                block: {
                  name: 'get-element-data',
                  selector: 'span.ss-c-workspace-detail__title',
                  findBy: 'cssSelector',
                  includeText: true,
                  attributes: ['id'],
                  option: { waitForSelector: true, waitSelectorTimeout: 5000, multiple: true },
                } as GetElementDataBlock,
              },
            ],
            parser: (result: any) => {
              const workspaceData = result.steps[0].result.data! || [];
              const mapped = (workspaceData as ElementData[]).map((it: ElementData) => ({
                elementId: (it.attributes?.['id'] || '').trim(),
                elementText: (it.text || '').trim(),
              }));
              const nonEmpty = mapped.filter(w => w.elementId || w.elementText || (w.elementId !== 'app' && w.elementId !== 'join'));
              const uniqueMap = new Map<string, { elementId: string; elementText: string }>();
              for (const w of nonEmpty) {
                const key = (w.elementId && `id:${w.elementId}`) || `text:${w.elementText}`;
                if (!uniqueMap.has(key)) {
                  uniqueMap.set(key, w);
                }
              }
              return Array.from(uniqueMap.values());
            },
            targetUrl: `https://slack.com/intl/ko-kr/`,
          },
        },
      },
      {
        id: 'checkbox',
        title: '관리자 권한 확인',
        uiSchema: {
          type: 'checkbox',
          workflow: {
            version: '1.0',
            start: 'checkAdmin',
            steps: [
              {
                id: 'checkAdmin',
                block: {
                  name: 'get-text',
                  selector: '#page_contents > h1',
                  findBy: 'cssSelector',
                  option: { waitForSelector: true, waitSelectorTimeout: 5000 },
                },
              },
            ],
            parser: (result: any) => {
              // @ts-ignore
              const pageTitle = ((result.steps[0].result.data as string) || '').toLowerCase();

              // Deny patterns for non-admin users across locales
              const denyPatterns = [
                'only workspace admins can view this page',
                'workspace admins can view this page',
                'only workspace owners and admins',
                '관리자만',
                '워크스페이스 관리자만',
              ];

              const isDenied = denyPatterns.some((pattern) => pageTitle.includes(pattern));
              return !isDenied;
            },
            targetUrl: `https://{{$.select-box.result}}.slack.com/admin`,
          },
        },
      },
      { 
        id: 'table',
        title: '멤버 연동',
        uiSchema: {
          type: 'table',
          workflow: {
            version: '1.0',
            start: 'collectEmails',
            steps: [
              { id: 'collectEmails', block: { name: 'get-text', selector: '[data-qa-column="workspace-members_table_email"] .c-truncate', findBy: 'cssSelector', option: { multiple: true } }, next: 'collectStatuses' },
              { id: 'collectStatuses', block: { name: 'get-text', selector: '[data-qa-column="workspace-members_table_account_status"] div div', findBy: 'cssSelector', option: { multiple: true } }, next: 'collectJoinDates' },
              { id: 'collectJoinDates', block: { name: 'get-text', selector: '[data-qa-column="workspace-members_table_created"] .c-table_cell', findBy: 'cssSelector', option: { multiple: true } } },
            ],
            parser: (result: any) => {
              const emails = result.steps[0].result.data || [];
              const statuses = result.steps[1].result.data || [];
              const joinDates = result.steps[2].result.data || [];

              const maxLength = Math.max(
                // @ts-ignore
                emails.length || 0,
                // @ts-ignore
                statuses.length || 0,
                // @ts-ignore
                joinDates.length || 0
              );
          
              const memberList: any[] = [];
              for (let i = 0; i < maxLength; i++) {
                memberList.push({
                  // @ts-ignore
                  email: (emails[i] as string) || 'N/A',
                  // @ts-ignore
                  status: (statuses[i] === "활성" ? "active" : "inactive"),
                  // @ts-ignore
                  joinDate: (joinDates[i] as string) || 'N/A',
                });
              }
              return memberList;
            },
            targetUrl: `https://{{$.select-box.result}}.slack.com/admin`,
          },
        },
      },
      { id: 'completion', title: '연동 완료' },
    ],
  }


