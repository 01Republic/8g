import { EightGClient, type ElementData, type GetElementDataBlock, type CollectDataResult, type GetTextBlock, type EventClickBlock, type Block, type ElementExistsBlock } from '8g-extension';
import type { ExtensionStatus, NotionMember, NotionWorkspace } from '../types';

export class NotionCrawler {
  private client: EightGClient;
  constructor() {
    this.client = new EightGClient();
  }

  async checkExtension(): Promise<ExtensionStatus> {
    const status = await this.client.checkExtension();
    return status as ExtensionStatus;
  }

  async collectWorkspaces(): Promise<NotionWorkspace[]> {
    const result: CollectDataResult<Block[]> = await this.client.collectData({
      targetUrl: 'https://www.notion.so',
      block: [
        {
          name: 'event-click',
          selector: '#notion-app > div > div > div:nth-child(1) > div > nav > div > div > div > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > div',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 5000,
          }
        } as EventClickBlock,
        {
          name: 'get-element-data',
          selector: 'div[role="menu"] > div > div [role="menuitem"]:has(.notion-record-icon) > div:nth-child(2) > div',
          findBy: 'cssSelector',
          includeText: true,
          includeXPath: true,
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 5000,
            multiple: true,
          }
        } as GetElementDataBlock
      ]
    });
    // @ts-ignore
    const workspaceData = result.data!.result[1].data || [];
    const mapped = (workspaceData as ElementData[]).map((it: ElementData) => ({
      elementText: (it.text || '').trim(),
      elementXPath: (it.xpath || '').trim(),
    }));
    console.log(mapped);
    const nonEmpty = mapped.filter(w => w.elementText);
    const uniqueMap = new Map<string, NotionWorkspace>();
    for (const w of nonEmpty) {
      const key = `text:${w.elementText}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, w);
      }
    }
    return Array.from(uniqueMap.values());
  }

  async hasAdminPermission(workspaceXPath: string): Promise<boolean> {
    const result: CollectDataResult<Block[]> = await this.client.collectData({
      targetUrl: 'https://www.notion.so',
      block: [
        {
          name: 'event-click',
          selector: '#notion-app > div > div > div:nth-child(1) > div > nav > div > div > div > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > div',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 5000,
          }
        } as EventClickBlock,
        {
            name: 'event-click',
            selector: workspaceXPath,
            findBy: 'xpath',
            option: {
                waitForSelector: true,
                waitSelectorTimeout: 3000,
            }
        } as EventClickBlock,
        {
          name: 'event-click',
          selector: '#notion-app > div > div > div:nth-child(1) > div > nav > div > div > div > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > div',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 5000,
          }
        } as EventClickBlock,
        {
          name: 'event-click',
          selector: '#notion-app > div > div > div.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 3000,
          }
        } as EventClickBlock,
        {
          name: 'element-exists',
          selector: '#settings-tab-teams',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 3000,
          }
        } as ElementExistsBlock,
      ]
    });

    // @ts-ignore
    return result.data!.result[4].data;
  }

  async collectMembers(workspaceXPath: string): Promise<NotionMember[]> {
    const result: CollectDataResult<Block[]> = await this.client.collectData({
      targetUrl: 'https://www.notion.so',
      block: [
        {
          name: 'event-click',
          selector: '#notion-app > div > div > div:nth-child(1) > div > nav > div > div > div > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > div',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 5000,
          }
        } as EventClickBlock,
        {
            name: 'event-click',
            selector: workspaceXPath,
            findBy: 'xpath',
            option: {
                waitForSelector: true,
                waitSelectorTimeout: 3000,
            }
        } as EventClickBlock,
        {
          name: 'event-click',
          selector: '#notion-app > div > div > div:nth-child(1) > div > nav > div > div > div > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > div',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 5000,
          }
        } as EventClickBlock,
        {
          name: 'event-click',
          selector: '#notion-app > div > div > div.notion-overlay-container.notion-default-overlay-container > div:nth-child(2) > div > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 3000,
          }
        } as EventClickBlock,
        {
          name: 'event-click',
          selector: '#settings-tab-members',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 3000,
          }
        } as EventClickBlock,
        {
          name: 'event-click',
          selector: '#settings-tabpanel-members > div:nth-child(1) > div > div:nth-child(4) > div.hide-scrollbar > div:nth-child(2) > div:nth-child(1)',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 3000,
          }
        } as EventClickBlock,
        {
          name: 'get-text',
          selector: '#settings-tabpanel-members > div:nth-child(1) > div > div:nth-child(4) > div:nth-child(2) > div > div > div > div:nth-child(2) > div > div > div > div:nth-child(1) > div > div > div > div:nth-child(2) > div:nth-child(2)',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 3000,
            multiple: true,
          }
        } as GetTextBlock
      ]
    });

    // @ts-ignore
    const members = result.data.result[6].data;
    const memberList: NotionMember[] = [];
    for (const member of members) {
      memberList.push({
        email: member,
        status: 'active',
        joinDate: null,
      });
    }
    console.log(memberList);
    return memberList;
  }
}


