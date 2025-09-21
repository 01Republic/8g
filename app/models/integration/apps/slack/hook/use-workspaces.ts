import { useState } from 'react';
import type { SlackWorkspace } from '../types';
import { SlackCrawler } from '../crawler/SlackCrawler';

export function useSlackWorkspaces() {
  const [workspaces, setWorkspaces] = useState<SlackWorkspace[]>([]);
  const [isCollectingWorkspaces, setIsCollectingWorkspaces] = useState(false);
  const crawler = new SlackCrawler();

  const collectWorkspaces = async () => {
    setIsCollectingWorkspaces(true);
    try {
      const uniqueWorkspaces = await crawler.collectWorkspaces();
      setWorkspaces(uniqueWorkspaces);
    } finally {
      setIsCollectingWorkspaces(false);
    }
  };

  return { workspaces, isCollectingWorkspaces, collectWorkspaces };
}


