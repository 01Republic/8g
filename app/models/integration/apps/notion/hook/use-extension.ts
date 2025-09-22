import { useState } from 'react';
import { NotionCrawler } from '../crawler/NotionCrawler';
import type { ExtensionStatus } from '../types';

export function useNotionExtension() {
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const crawler = new NotionCrawler();

  const checkExtension = async () => {
    setIsChecking(true);
    try {
      const status = await crawler.checkExtension();
      setExtensionStatus(status);
    } catch (error) {
      console.error('Extension check failed:', error);
      setExtensionStatus({ installed: false, version: null });
    } finally {
      setIsChecking(false);
    }
  };

  return { extensionStatus, isChecking, checkExtension };
}


