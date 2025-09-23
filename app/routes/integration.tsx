import { IntegrationAppCard } from "~/models/integration/components/IntegrationAppCard";
import { IntegartionAppModal } from "~/models/integration/components/IntegrationAppModal";
import { useEffect, useState } from "react";
import { authMiddleware } from "~/middleware/auth";
import { userContext } from "~/context";
import { useFetcher } from "react-router";
import { slackMetadata } from "~/models/integration/apps/IntegrationAppFormMetadata";
import { getSession, commitSession } from "~/session";
import type { Route } from "./+types/integration";
import type { Product } from "~/models/products/types/Product";
const { initializeDatabase } = await import("~/.server/db");
const { Products } = await import("~/.server/db/entities/Products");
const { SubscriptionService } = await import("~/.server/db/services/subscription.service");

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];
  
export async function loader({
  request,
}: Route.LoaderArgs){
    await initializeDatabase()
    const apps = await Products.createQueryBuilder('product')
        .leftJoinAndSelect('product.productTags', 'productTag')  // 1차 조인
        .leftJoinAndSelect('productTag.tag', 'tag')              // 2차 조인
        .where('(product.searchText LIKE :kw1 OR product.searchText LIKE :kw2)', {
            kw1: '%slack%',
            kw2: '%slack%',
          })
          .getMany();
    const session = await getSession(request.headers.get('Cookie'))
    const error = session.get('error') || null
    const success = error ? false : true
    return new Response(
      JSON.stringify({ apps, flash: { success, error } }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': await commitSession(session),
        },
      }
    )
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
        await slackService.saveSubscription({
            workspace,
            members,
            organizationId,
            productId
        })
        const session = await getSession(request.headers.get('Cookie'))
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/integration',
            'Set-Cookie': await commitSession(session),
          },
        })
    } catch (error) {
        const session = await getSession(request.headers.get('Cookie'))
        session.flash('error', error instanceof Error ? error.message : 'Unknown error')
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/integration',
            'Set-Cookie': await commitSession(session),
          },
        })
    }
}

export default function Integration(
    { loaderData }: Route.ComponentProps
) {
    const { apps, flash } = loaderData as { apps: Product[], flash: { success: boolean, error: string } }
    const [open, setOpen] = useState(false)
    const [productId, setProductId] = useState<number>(apps[0]?.id || 1)
    const fetcher = useFetcher()

    useEffect(() => {
      if (flash?.success) {
        setOpen(false)
      }
      if (flash?.error) {
        console.error('Save integration failed:', flash.error)
      }
    }, [flash?.success, flash?.error])

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
                            onOpen={(pid) => { 
                                setProductId(pid); 
                                setOpen(true); 
                            }}
                        />
                    ))}
                </div>

                <IntegartionAppModal 
                    open={open} 
                    setOpen={setOpen} 
                    onSubmit={ async (payload: { workspace?: any; members?: any[]; productId: number }) => {
                        const formData = new FormData()
                        if (payload.workspace) formData.append('workspace', JSON.stringify(payload.workspace))
                        formData.append('members', JSON.stringify(payload.members))
                        formData.append('productId', payload.productId.toString())
                        fetcher.submit(formData, { method: 'POST' })
                    }}
                    meta={slackMetadata}
                    productId={productId}
                />
            </div>
        </div>
    )
}