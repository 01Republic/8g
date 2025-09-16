import { IntegrationAppCard } from "~/models/integration/components/IntegrationAppCard";
import type { Route } from "../+types/root";
const { initializeDatabase } = await import("~/.server/db");
const { Products } = await import("~/.server/db/entities/Products");

const searchTextDev = "slack"

export interface IntegrationApp {
    nameKo: string;
    nameEn: string;
    tagline: string | null;
    image: string;
    productTags: Array<{
      tag: {
        name: string;
      };
    }>;
  }

export async function loader(): Promise<{ apps: IntegrationApp[] }> {
    await initializeDatabase()
    const apps = await Products.createQueryBuilder('product')
        .leftJoinAndSelect('product.productTags', 'productTag')  // 1차 조인
        .leftJoinAndSelect('productTag.tag', 'tag')              // 2차 조인
        .where('product.searchText LIKE :search', { 
            search: `%${searchTextDev}%` 
        })
        .getMany()
        
    return { apps }
}

export default function Integration(
    { loaderData }: Route.ComponentProps
) {
    const { apps } = loaderData || { apps: [] as IntegrationApp[] }

    return (
        <div className="h-full w-full p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold mb-2">SaaS 연동 앱</h1>
                    <p className="text-gray-400">SaaS 연동 앱을 검색해주세요</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map((app, index: number) => (
                        <IntegrationAppCard
                            key={index}
                            appKoreanName={app.nameKo}
                            appEnglishName={app.nameEn}
                            appDescription={app.tagline || "No description"}
                            appLogo={app.image}
                            category={app.productTags.map((tag) => tag.tag.name).join(", ") || ""}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}