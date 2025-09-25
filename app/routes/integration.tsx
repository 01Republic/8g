import { IntegrationAppCard } from "~/models/integration/components/IntegrationAppCard";
import { IntegartionAppModal } from "~/models/integration/components/IntegrationAppModal";
import { useEffect, useState } from "react";
import { authMiddleware } from "~/middleware/auth";
import { userContext } from "~/context";
import { useFetcher } from "react-router";
import { getSession, commitSession } from "~/session";
import type { Route } from "./+types/integration";
import type { Product } from "~/models/products/types/Product";
import type { SelectedWorkspace } from "~/models/integration/apps/components/sections/SelectBoxSection";
import type { SelectedMembers } from "~/models/integration/apps/components/sections/TableSection";
import { IntegrationAppFormMetadata as IntegrationAppFormMetadataEntity } from "~/.server/db/entities/IntegrationAppFormMetadata";
import type { IntegrationAppFormMetadata } from "~/models/integration/apps/IntegrationAppFormMetadata";
const { initializeDatabase } = await import("~/.server/db");
const { Products } = await import("~/.server/db/entities/Products");
const { SubscriptionService } = await import("~/.server/db/services/subscription.service");

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];
  
export async function loader({ request }: Route.LoaderArgs): Promise<Response> {
  try {
    await initializeDatabase();

    // 세션 및 플래시 메시지 처리
    const session = await getSession(request.headers.get('Cookie'));
    const error = session.get('error') || null;
    const success = !error;

    // 응답 생성 헬퍼 함수
    const createResponse = async (data: any) => {
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': await commitSession(session),
        },
      });
    };

    // 활성화된 통합 앱 메타데이터 조회
    const integrationAppFormMetadata = await IntegrationAppFormMetadataEntity.find({ 
      where: { isActive: true } 
    });

    // 메타데이터가 없으면 빈 결과 반환
    if (integrationAppFormMetadata.length === 0) {
      return createResponse({
        apps: [],
        flash: { success, error },
        integrationAppFormMetadata: []
      });
    }

    // 제품 조회 쿼리 실행
    const productIds = integrationAppFormMetadata.map(item => item.productId);
    
    const apps = await Products.createQueryBuilder('product')
      .leftJoinAndSelect('product.productTags', 'productTag')
      .leftJoinAndSelect('productTag.tag', 'tag')
      .andWhere('product.id IN (:...productIds)', { productIds })
      .getMany();

    return createResponse({
      apps,
      flash: { success, error },
      integrationAppFormMetadata
    });

  } catch (error) {
    console.error('Loader error:', error);
    
    // 에러 발생 시 세션에 에러 메시지 저장
    const session = await getSession(request.headers.get('Cookie'));
    const errorMessage = error instanceof Error 
      ? `데이터 로딩 실패: ${error.message}` 
      : '알 수 없는 오류가 발생했습니다.';
    
    session.flash('error', errorMessage);

    return new Response(JSON.stringify({
      apps: [],
      flash: { 
        success: false, 
        error: errorMessage 
      },
      integrationAppFormMetadata: []
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': await commitSession(session),
      },
    });
  }
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
    const { apps, flash, integrationAppFormMetadata } = loaderData as { apps: Product[], flash: { success: boolean, error: string }, integrationAppFormMetadata: IntegrationAppFormMetadataEntity[] }
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

    // 흠 이 부분은 나중에 실시간 반영을 위해서 fetch 하는 방식으로 변경
    const getMetadata = (): IntegrationAppFormMetadata => {
      const meta = integrationAppFormMetadata.find((it) => it.productId === productId)?.meta;
      return meta as unknown as IntegrationAppFormMetadata;
    };

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
                {getMetadata() && (<IntegartionAppModal 
                    open={open} 
                    setOpen={setOpen} 
                    onSubmit={ async (payload: { workspace: SelectedWorkspace; members: SelectedMembers[]; productId: number }) => {
                        const formData = new FormData()
                        if (payload.workspace) formData.append('workspace', JSON.stringify(payload.workspace))
                        formData.append('members', JSON.stringify(payload.members))
                        formData.append('productId', payload.productId.toString())
                        fetcher.submit(formData, { method: 'POST' })
                    }}
                    meta={getMetadata()}
                    productId={productId}
                />
                )}
            </div>
        </div>
    )
}