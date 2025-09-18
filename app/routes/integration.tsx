import { IntegrationAppCard } from "~/models/integration/components/IntegrationAppCard";
import { IntegartionAppModal } from "~/models/integration/components/IntegrationAppModal";
import { useState } from "react";
import type { Route } from "./+types/integration";
import { authMiddleware } from "~/middleware/auth";
const { initializeDatabase } = await import("~/.server/db");
const { Products } = await import("~/.server/db/entities/Products");

const searchTextDev = "slack"

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];
  
export async function loader() {
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
    const { apps } = loaderData
    const [open, setOpen] = useState(false)

    return (
        <div className="h-full w-full p-8">
            <div className="max-w-6xl ml-4">
                <div className="mb-8">
                    <h1 className="mt-4 ml-16 text-2xl font-semibold mb-2">SaaS 연동 앱</h1>
                    <p className="ml-16 text-gray-400">SaaS 연동 앱을 검색해주세요</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-12">
                    {apps.map((app, index: number) => (
                        <IntegrationAppCard
                            key={index}
                            appInfo={app}
                            openIntegartionModal={setOpen}
                        />
                    ))}
                </div>

                <IntegartionAppModal open={open} setOpen={setOpen} service="slack"/>
            </div>
        </div>
    )
}