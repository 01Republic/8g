import { IntegrationAppCard } from "~/models/integration/components/IntegrationAppCard";
import { SearchIntegrationAppCommand } from "~/models/integration/components/SearchIntegrationAppCommand";

const apps = [
    {
        appKoreanName: "옵스나우",
        appEnglishName: "Opsnow",
        appDescription: "안전한 클라우드 관리를 위한 자동화된 통합 플랫폼 OpsNow360 어떻게 달라졌을까요?? 조금더 자세히 알아보고 싶으시다면 연결해주세요",
        appLogo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
        category: "Engineering"
    }
]

export default function Integration() {
    return (
        <div className="h-full w-full p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold mb-2">SaaS 연동 앱</h1>
                    <p className="text-gray-400">SaaS 연동 앱을 검색해주세요</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map((app, index) => (
                        <IntegrationAppCard
                            key={index}
                            appKoreanName={app.appKoreanName}
                            appEnglishName={app.appEnglishName}
                            appDescription={app.appDescription}
                            appLogo={app.appLogo}
                            category={app.category}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}