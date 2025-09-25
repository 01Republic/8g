import type { ElementData, GetElementDataBlock } from "8g-extension"
import type { CheckboxSectionSchema, IntegrationAppFormMetadata } from "./types"

// TODO: 이 파일을 삭제할 예정입니다.
// 이 파일은 slack 연동 테스트를 위한 파일입니다.
// 이 파일은 삭제할 예정입니다.
export const slackMetadata: IntegrationAppFormMetadata = {
    sections: [
      { 
        id: 'initial-check',
        uiSchema: {
          title: 'Extension 상태 확인',
          type: 'initial-check',
        }
      },
      {
        id: 'select-box',
        uiSchema: {
          title: '워크스페이스 선택',
          type: 'select-box',
          placeholder: '워크스페이스를 선택하세요',
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
        uiSchema: {
          title: '관리자 권한 확인',
          type: 'checkbox',
          loadingMessage: '관리자 권한 확인 중...',
          errorMessage: '관리자 권한 없음: 워크스페이스 관리자만 접근할 수 있습니다.',
          successMessage: '관리자 권한 확인됨',
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
        } as CheckboxSectionSchema,
      },
      { 
        id: 'table',
        uiSchema: {
          title: '멤버 연동',
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
      { id: 'completion', uiSchema: { type: 'completion', title: '연동 완료' } },
    ],
  }


