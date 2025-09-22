import { useState } from 'react';
import { NotionCrawler } from '../crawler/NotionCrawler';

export function useNotionAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const crawler = new NotionCrawler();

  const checkAdminPermission = async (workspaceXPath: string) => {
    if (!workspaceXPath) {
      throw new Error('Workspace XPath가 필요합니다.');
    }
    setIsCheckingAdmin(true);
    try {
      const allowed = await crawler.hasAdminPermission(workspaceXPath);
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


