import { useState } from 'react';
import { SlackCrawler } from '../crawler/SlackCrawler';

export function useSlackAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const crawler = new SlackCrawler();

  const checkAdminPermission = async (workspaceId: string) => {
    if (!workspaceId) {
      throw new Error('Workspace ID가 필요합니다.');
    }
    setIsCheckingAdmin(true);
    try {
      const allowed = await crawler.hasAdminPermission(workspaceId);
      setIsAdmin(allowed);
    } catch (error) {
      console.error('Admin permission check failed:', error);
      setIsAdmin(false);
      throw error;
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  const resetAdminStatus = () => setIsAdmin(null);

  return { isAdmin, isCheckingAdmin, checkAdminPermission, resetAdminStatus };
}


