import { useState } from 'react';
import type { NotionWorkspace } from '../types';
import { NotionCrawler } from '../crawler/NotionCrawler';

export function useNotionWorkspaces() {
  const [workspaces, setWorkspaces] = useState<NotionWorkspace[]>([]);
  const [isCollectingWorkspaces, setIsCollectingWorkspaces] = useState(false);
  const crawler = new NotionCrawler();

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


