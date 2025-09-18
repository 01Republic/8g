import { useState } from 'react';
import { EightG, type ExtensionStatus } from './8g-extension-interface';

export interface SlackWorkspace {
  elementId: string;
  elementText: string;
  timestamp: string;
}

export interface SlackMember {
  email: string;
  status: string;
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
      const status = await EightG.checkInstalled();
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
      const result = await EightG.collectIdAndText(
        'https://slack.com/intl/ko-kr',
        'span.ss-c-workspace-detail__title'
      );
      setWorkspaces(result);
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
      const h1Text = await EightG.collectText(
        adminUrl,
        '#page_contents > h1',
        { multiple: false }
      );
      
      const pageTitle = h1Text[0] || '';
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
      
      // 각 컬럼별로 데이터를 수집
      const [emails, statuses, joinDates] = await Promise.all([
        EightG.collectText(adminUrl, '[data-qa-column="workspace-members_table_email"] .c-truncate', { multiple: true }),
        EightG.collectText(adminUrl, '[data-qa-column="workspace-members_table_account_status"] div div', { multiple: true }),
        EightG.collectText(adminUrl, '[data-qa-column="workspace-members_table_created"] .c-table_cell', { multiple: true })
      ]);

      // 각 배열을 결합하여 멤버 객체 생성
      const maxLength = Math.max(emails.length, statuses.length, joinDates.length);
      const memberList: SlackMember[] = [];
      
      for (let i = 0; i < maxLength; i++) {
        memberList.push({
          email: emails[i] || 'N/A',
          status: statuses[i] || 'N/A',
          joinDate: joinDates[i] || 'N/A'
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