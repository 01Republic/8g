import { useEffect, useState } from "react";
import type { AppType } from "~/models/apps/types";
import { AppSearch } from "./AppSearch";
import { AppCard } from "./AppCard";



interface HomePageProps {
    userName: string
    apps: AppType[]
}

export default function HomePage(props: HomePageProps) {

    const {userName, apps} = props;

    const [predictions, setPredictions] = useState<string[]>([]);
    const [query, setQuery] = useState("");
  
    useEffect(() => { 
      setPredictions(apps.filter((app) => app.appKoreanName.toLowerCase().includes(query.toLowerCase())).map(it => it.appKoreanName));
    }, [query]);
  

   return  <div className="flex flex-col items-center h-full w-full p-8 pt-64 gap-12">
    {/* 상단 타이틀이랑 검색창 색션 */}
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          안녕하세요 {userName}님, 어떤 앱을 쓰고 계신가요?
        </h1>
      </div>
      
      <div className="relative w-full">
        <AppSearch
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
          최근 등록한 앱
        </h3>
        <div className="grid grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard 
              key={app.id} 
              appName={app.appKoreanName + " / " + app.appEnglishName} 
              appLogo={app.appLogo} 
              lastUsedAt={app.nextBillingDate || new Date()} 
            />
          ))}
        </div>
      </div>
    </div>
  </div>
}