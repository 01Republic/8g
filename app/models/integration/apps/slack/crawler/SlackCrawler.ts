import { EightGClient, type ElementData, type GetElementDataBlock, type CollectDataResult, type GetTextBlock } from '8g-extension';
import type { ExtensionStatus, SlackWorkspace, SlackMember } from '../types';

export class SlackCrawler {
  private client: EightGClient;
  constructor() {
    this.client = new EightGClient();
  }

  async checkExtension(): Promise<ExtensionStatus> {
    const status = await this.client.checkExtension();
    return status as ExtensionStatus;
  }

  async collectWorkspaces(): Promise<SlackWorkspace[]> {
    const result: CollectDataResult<ElementData[] | ElementData> = await this.client.collectData({
      targetUrl: 'https://slack.com/intl/ko-kr',
      block: {
        name: 'get-element-data',
        selector: 'span.ss-c-workspace-detail__title',
        findBy: 'cssSelector',
        includeText: true,
        attributes: ['id'],
        option: {
          waitForSelector: true,
          waitSelectorTimeout: 5000,
          multiple: true,
        }
      } as GetElementDataBlock
    });

    const workspaceData = result.data!.result.data || [];
    const mapped = (workspaceData as ElementData[]).map((it: ElementData) => ({
      elementId: (it.attributes?.['id'] || '').trim(),
      elementText: (it.text || '').trim(),
    }));
    const nonEmpty = mapped.filter(w => w.elementId || w.elementText);
    const uniqueMap = new Map<string, { elementId: string; elementText: string }>();
    for (const w of nonEmpty) {
      const key = (w.elementId && `id:${w.elementId}`) || `text:${w.elementText}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, w);
      }
    }
    return Array.from(uniqueMap.values());
  }

  async hasAdminPermission(workspaceId: string): Promise<boolean> {
    const adminUrl = `https://${workspaceId}.slack.com/admin`;
    const h1Text = await this.client.collectData({
      targetUrl: adminUrl,
      block: {
        name: 'get-text',
        selector: '#page_contents > h1',
        findBy: 'cssSelector',
        option: { waitForSelector: true, waitSelectorTimeout: 5000, multiple: false }
      } as GetTextBlock
    });
    const pageTitle = ((h1Text.data?.result.data as string) || '').toLowerCase();

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
  }

  async collectMembers(workspaceId: string): Promise<SlackMember[]> {
    const adminUrl = `https://${workspaceId}.slack.com/admin`;

    const [emails, statuses, joinDates] = await Promise.all([
      this.client.collectData({
        targetUrl: adminUrl,
        block: {
          name: 'get-text',
          selector: '[data-qa-column="workspace-members_table_email"] .c-truncate',
          findBy: 'cssSelector',
          option: { multiple: true }
        } as GetTextBlock
      }),
      this.client.collectData({
        targetUrl: adminUrl,
        block: {
          name: 'get-text',
          selector: '[data-qa-column="workspace-members_table_account_status"] div div',
          findBy: 'cssSelector',
          option: { multiple: true }
        } as GetTextBlock
      }),
      this.client.collectData({
        targetUrl: adminUrl,
        block: {
          name: 'get-text',
          selector: '[data-qa-column="workspace-members_table_created"] .c-table_cell',
          findBy: 'cssSelector',
          option: { multiple: true }
        } as GetTextBlock
      })
    ]);

    const maxLength = Math.max(
      emails.data?.result.data.length || 0,
      statuses.data?.result.data.length || 0,
      joinDates.data?.result.data.length || 0
    );

    const memberList: SlackMember[] = [];
    for (let i = 0; i < maxLength; i++) {
      memberList.push({
        email: (emails.data?.result.data[i] as string) || 'N/A',
        status: (statuses.data?.result.data[i] === "활성" ? "active" : "inactive"),
        joinDate: (joinDates.data?.result.data[i] as string) || 'N/A',
      });
    }
    return memberList;
  }
}


