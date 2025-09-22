import { IntegrationAppCard } from "~/models/integration/components/IntegrationAppCard";
import { IntegartionAppModal } from "~/models/integration/components/IntegrationAppModal";
import { useState } from "react";
import type { Route } from "./+types/integration";
import { authMiddleware } from "~/middleware/auth";
import { userContext } from "~/context";
const { initializeDatabase } = await import("~/.server/db");
const { Products } = await import("~/.server/db/entities/Products");
const { SubscriptionService } = await import("~/.server/db/services/subscription.service");

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];
  
export async function loader() {
    await initializeDatabase()
    const apps = await Products.createQueryBuilder('product')
        .leftJoinAndSelect('product.productTags', 'productTag')  // 1차 조인
        .leftJoinAndSelect('productTag.tag', 'tag')              // 2차 조인
        .where('(product.searchText LIKE :kw1 OR product.searchText LIKE :kw2)', {
            kw1: '%slack%',
            kw2: '%slack%',
          })
          .getMany();
        
    return { apps }
}

export async function action({ request, context }: Route.ActionArgs) {
    await initializeDatabase()
    
    const user = context.get(userContext);
    const formData = await request.formData()
    
    const workspace = JSON.parse(formData.get('workspace') as string)
    const members = JSON.parse(formData.get('members') as string)
    const organizationId = user!.orgId
    const productId = parseInt(formData.get('productId') as string)
    
    try {
        const slackService = new SubscriptionService()
        const result = await slackService.saveSubscription({
            workspace,
            members,
            organizationId,
            productId
        })
        
        return {
            success: true,
            data: result
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

export default function Integration(
    { loaderData }: Route.ComponentProps
) {
    const { apps } = loaderData
    const [open, setOpen] = useState(false)
    const [service, setService] = useState<'slack' | 'notion'>('slack')
    const [productId, setProductId] = useState<number>(apps[0]?.id || 1)

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
                            onOpen={(svc, pid) => { 
                                const safe = (svc === 'slack' || svc === 'notion') ? svc : 'slack';
                                setService(safe); 
                                setProductId(pid); 
                                setOpen(true); 
                            }}
                        />
                    ))}
                </div>

                <IntegartionAppModal 
                    open={open} 
                    setOpen={setOpen} 
                    service={"slack"}
                    organizationId={1} // TODO: Get from auth context
                    productId={productId}
                />
            </div>
        </div>
    )
}