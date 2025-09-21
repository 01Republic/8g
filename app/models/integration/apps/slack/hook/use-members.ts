import { useState } from 'react';
import { SlackCrawler } from '../crawler/SlackCrawler';
import type { SlackMember } from '../types';

export function useSlackMembers() {
  const [members, setMembers] = useState<SlackMember[]>([]);
  const [isCollectingMembers, setIsCollectingMembers] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const crawler = new SlackCrawler();

  const collectMembers = async (workspaceId: string) => {
    if (!workspaceId) {
      throw new Error('Workspace ID가 필요합니다.');
    }
    setIsCollectingMembers(true);
    setMembersError(null);
    try {
      const list = await crawler.collectMembers(workspaceId);
      setMembers(list);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '멤버 수집 중 오류가 발생했습니다.';
      setMembersError(message);
    } finally {
      setIsCollectingMembers(false);
    }
  };

  const resetMembers = () => setMembers([]);

  return { members, isCollectingMembers, membersError, collectMembers, resetMembers, setMembersError };
}


