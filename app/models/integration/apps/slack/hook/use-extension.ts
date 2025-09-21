import { useState } from 'react';
import { SlackCrawler } from '../crawler/SlackCrawler';
import type { ExtensionStatus } from '../types';

export function useSlackExtension() {
  const [extensionStatus, setExtensionStatus] = useState<ExtensionStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const crawler = new SlackCrawler();

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


