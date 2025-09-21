import { useState } from 'react';
import { EightGClient, type CollectDataResult, type ElementData, type GetElementDataBlock, type GetTextBlock } from '8g-extension';

export interface ExtensionStatus {
  installed: boolean;
  version: string | null;
}

export interface SlackWorkspace {
  elementId: string;
  elementText: string;
  timestamp: string;
}

export interface SlackMember {
  email: string;
  status: "활성" | "비활성화됨";
  joinDate: string;
}

export interface UseSlackIntegrationReturn {
  // Extension status
  extensionStatus: ExtensionStatus | null;
  isChecking: boolean;
  checkExtension: () => Promise<void>;

  // Workspace collection
  workspaces: SlackWorkspace[];
  isCollectingWorkspaces: boolean;
  collectWorkspaces: () => Promise<void>;

  // Admin permission check
  isAdmin: boolean | null;
  isCheckingAdmin: boolean;
  checkAdminPermission: (workspaceId: string) => Promise<void>;

  // Member collection
  members: SlackMember[];
  isCollectingMembers: boolean;
  collectMembers: (workspaceId: string) => Promise<void>;

  // Reset functions
  resetAdminStatus: () => void;
  resetMembers: () => void;
  resetAll: () => void;
}

export function useSlackIntegration(): UseSlackIntegrationReturn {
  // Extension status
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Workspace data
  const [workspaces, setWorkspaces] = useState<SlackWorkspace[]>([]);
  const [isCollectingWorkspaces, setIsCollectingWorkspaces] = useState(false);

  // Admin permission
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

  // Member data
  const [members, setMembers] = useState<SlackMember[]>([]);
  const [isCollectingMembers, setIsCollectingMembers] = useState(false);

  const checkExtension = async () => {
    setIsChecking(true);
    try {
      const client = new EightGClient();
      const status = await client.checkExtension();
      setExtensionStatus(status);
    } catch (error) {
      console.error('Extension check failed:', error);
      setExtensionStatus({ installed: false, version: null });
    } finally {
      setIsChecking(false);
    }
  };

  const collectWorkspaces = async () => {
    if (!extensionStatus?.installed) {
      throw new Error('8G Extension이 설치되지 않았습니다.');
    }

    setIsCollectingWorkspaces(true);
    try {
      const client = new EightGClient();

      const result: CollectDataResult<ElementData[] | ElementData> = await client.collectData({
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

      console.log(workspaceData)

      // 1) 매핑 + 공백 트림
      const mapped = (workspaceData as ElementData[]).map((it: ElementData) => ({
        elementId: (it.attributes?.['id'] || '').trim(),
        elementText: (it.text || '').trim(),
      }));

      // 2) 빈 값 제거
      const nonEmpty = mapped.filter(w => w.elementId || w.elementText);

      // 3) 중복 제거 (id 우선, 없으면 텍스트 기준)
      const uniqueMap = new Map<string, { elementId: string; elementText: string }>();
      for (const w of nonEmpty) {
        const key = (w.elementId && `id:${w.elementId}`) || `text:${w.elementText}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, w);
        }
      }

      const uniqueWorkspaces = Array.from(uniqueMap.values());

      setWorkspaces(uniqueWorkspaces as any);
    } catch (error) {
      console.error('Workspace collection failed:', error);
      throw error;
    } finally {
      setIsCollectingWorkspaces(false);
    }
  };

  const checkAdminPermission = async (workspaceId: string) => {
    if (!workspaceId) {
      throw new Error('Workspace ID가 필요합니다.');
    }

    setIsCheckingAdmin(true);
    try {
      const adminUrl = `https://${workspaceId}.slack.com/admin`;

      const client = new EightGClient();
      const h1Text = await client.collectData({
        targetUrl: adminUrl,
        block: {
          name: 'get-text',
          selector: '#page_contents > h1',
          findBy: 'cssSelector',
          option: {
            waitForSelector: true,
            waitSelectorTimeout: 5000,
            multiple: false,
          }
        } as GetTextBlock
      });
      
      const pageTitle = h1Text.data?.result.data as string || '';
      const hasAdminAccess = !pageTitle.includes('워크스페이스 관리자만 이 페이지를 볼 수 있습니다.');
      
      setIsAdmin(hasAdminAccess);
      
    } catch (error) {
      console.error('Admin permission check failed:', error);
      setIsAdmin(false);
      throw error;
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  const collectMembers = async (workspaceId: string) => {
    if (!workspaceId) {
      throw new Error('Workspace ID가 필요합니다.');
    }

    setIsCollectingMembers(true);
    try {
      const adminUrl = `https://${workspaceId}.slack.com/admin`;
      const client = new EightGClient();
      
      const [emails, statuses, joinDates] = await Promise.all([
        client.collectData({
          targetUrl: adminUrl, 
          block: {
            name: 'get-text',
            selector: '[data-qa-column="workspace-members_table_email"] .c-truncate', 
            findBy: 'cssSelector',
            option: { multiple: true }
          } as GetTextBlock
        }),
        client.collectData({
          targetUrl: adminUrl, 
          block: {
            name: 'get-text',
            selector: '[data-qa-column="workspace-members_table_account_status"] div div', 
            findBy: 'cssSelector',
            option: { multiple: true }
          } as GetTextBlock
        }),
        client.collectData({
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
        emails.data?.result.data.length, 
        statuses.data?.result.data.length,
        joinDates.data?.result.data.length
      );
      const memberList: SlackMember[] = [];
      
      for (let i = 0; i < maxLength; i++) {
        memberList.push({
          email: emails.data?.result.data[i] || 'N/A',
          status: statuses.data?.result.data[i] as any,
          joinDate: joinDates.data?.result.data[i] || 'N/A',
        });
      }

      setMembers(memberList);
    } catch (error) {
      console.error('Member collection failed:', error);
      throw error;
    } finally {
      setIsCollectingMembers(false);
    }
  };

  const resetAdminStatus = () => {
    setIsAdmin(null);
  };

  const resetMembers = () => {
    setMembers([]);
  };

  const resetAll = () => {
    setExtensionStatus(null);
    setWorkspaces([]);
    setIsAdmin(null);
    setMembers([]);
  };

  return {
    // Extension status
    extensionStatus,
    isChecking,
    checkExtension,

    // Workspace collection
    workspaces,
    isCollectingWorkspaces,
    collectWorkspaces,

    // Admin permission check
    isAdmin,
    isCheckingAdmin,
    checkAdminPermission,

    // Member collection
    members,
    isCollectingMembers,
    collectMembers,

    // Reset functions
    resetAdminStatus,
    resetMembers,
    resetAll,
  };
}