import { useState, useEffect } from "react";
import { SearchCommand } from "~/models/home/components/SearchCommand";
import type { Route } from "./+types/home";
import { RecentAppCard } from "~/models/home/components/RecentAppCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const apps = [
  "Slack",
  "Google Drive",
  "Google Calendar",
  "Google Docs",
  "Google Sheets",
  "Google Slides",
  "Google Forms",
  "Notion",
  "Trello",
  "Asana",
  "Jira",
  "Monday",
  "Basecamp",
  "Trello",
]

const recentApps = [
  {
      appKoreanName: "옵스나우",
      appEnglishName: "Opsnow",
      appDescription: "안전한 클라우드 관리를 위한 자동화된 통합 플랫폼 OpsNow360 어떻게 달라졌을까요?? 조금더 자세히 알아보고 싶으시다면 연결해주세요",
      appLogo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      category: "Engineering",
      lastUsedAt: new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000) // 5 months ago
  },
  {
      appKoreanName: "슬랙",
      appEnglishName: "Slack",
      appDescription: "팀 협업을 위한 메시징 플랫폼",
      appLogo: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
      category: "Communication",
      lastUsedAt: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000) // 2 months ago
  },
  {
      appKoreanName: "노션",
      appEnglishName: "Notion",
      appDescription: "올인원 워크스페이스",
      appLogo: "https://www.notion.so/images/logo-ios.png",
      category: "Productivity",
      lastUsedAt: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000) // 1 month ago
  }
]

export default function Home() {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setPredictions(apps.filter((app) => app.toLowerCase().includes(query.toLowerCase())));
  }, [query]);

  return (
    <div className="flex flex-col items-center h-full w-full p-8 pt-64 gap-12">
      {/* 상단 타이틀이랑 검색창 색션 */}
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            안녕하세요 선진님, 어떤 앱을 쓰고 계신가요?
          </h1>
        </div>
        
        <div className="relative w-full">
          <SearchCommand 
            query={query}
            onQueryChange={setQuery}
            predictions={predictions}
          />
        </div>
      </div>

      {/* 최근 사용한 앱 */}
      <div className="w-full max-w-4xl space-y-6 mt-12">
        <div className="text-left">
          <h3 className="text-xl font-semibold text-gray-900 mb-8">
            최근 사용한 앱
          </h3>
          <div className="grid grid-cols-3 gap-6">
            {recentApps.map((app) => (
              <RecentAppCard 
                key={app.appKoreanName} 
                appName={app.appKoreanName + " / " + app.appEnglishName} 
                appLogo={app.appLogo} 
                lastUsedAt={app.lastUsedAt} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
