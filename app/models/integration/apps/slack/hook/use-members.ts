import { useState } from 'react';
import { SlackCrawler } from '../crawler/SlackCrawler';
import type { SlackMember } from '../types';

export function useSlackMembers() {
  const [members, setMembers] = useState<SlackMember[]>([]);
  const [isCollectingMembers, setIsCollectingMembers] = useState(false);
  const crawler = new SlackCrawler();

  const collectMembers = async (workspaceId: string) => {
    if (!workspaceId) {
      throw new Error('Workspace ID가 필요합니다.');
    }
    setIsCollectingMembers(true);
    try {
      const list = await crawler.collectMembers(workspaceId);
      setMembers(list);
    } finally {
      setIsCollectingMembers(false);
    }
  };

  const resetMembers = () => setMembers([]);

  return { members, isCollectingMembers, collectMembers, resetMembers };
}


