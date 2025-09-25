import { authMiddleware } from "~/middleware/auth";
import { userContext } from "~/context";
import { useFetcher } from "react-router";
import type { Route } from "./+types/integration";
import type { SelectedWorkspace } from "~/models/integration/apps/components/sections/SelectBoxSection";
import type { SelectedMembers } from "~/models/integration/apps/components/sections/TableSection";
import { IntegrationAppFormMetadata as IntegrationAppFormMetadataEntity } from "~/.server/db/entities/IntegrationAppFormMetadata";
import type { IntegrationAppFormMetadata } from "~/models/integration/apps/IntegrationAppFormMetadata";
import IntegrationPage from "~/client/private/integration/IntegrationPage";
const { initializeDatabase } = await import("~/.server/db");
const { Products } = await import("~/.server/db/entities/Products");
const { SubscriptionService } = await import("~/.server/db/services/subscription.service");

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];
  
export async function loader({ request }: Route.LoaderArgs) {
  await initializeDatabase();

  // 활성화된 통합 앱 메타데이터 조회
  const integrationAppFormMetadata = await IntegrationAppFormMetadataEntity.find({ 
    where: { isActive: true } 
  });

  // 메타데이터가 없으면 빈 결과 반환
  if (integrationAppFormMetadata.length === 0) {
    return {
      products: [],
      integrationAppFormMetadata: []
    };
  }

  // 제품 조회 쿼리 실행
  const productIds = integrationAppFormMetadata.map(item => item.productId);
  
  const products = await Products.createQueryBuilder('product')
    .leftJoinAndSelect('product.productTags', 'productTag')
    .leftJoinAndSelect('productTag.tag', 'tag')
    .andWhere('product.id IN (:...productIds)', { productIds })
    .getMany();

  return {
    products,
    integrationAppFormMetadata
  };
}

export async function action({ request, context }: Route.ActionArgs) {
    await initializeDatabase()
    
    const user = context.get(userContext);
    const formData = await request.formData()
    
    const workspace = JSON.parse(formData.get('workspace') as string)
    const members = JSON.parse(formData.get('members') as string)
    const organizationId = user!.orgId
    const productId = parseInt(formData.get('productId') as string)
    
    const subscriptionService = new SubscriptionService()
    await subscriptionService.saveSubscription({
        workspace,
        members,
        organizationId,
        productId
    })
}

export default function Integration(
    { loaderData }: Route.ComponentProps
) {
    const { products, integrationAppFormMetadata } = loaderData
    const fetcher = useFetcher()

    const onSubmit = (payload: { workspace: SelectedWorkspace; members: SelectedMembers[]; productId: number }) => {
      const formData = new FormData()
      if (payload.workspace) formData.append('workspace', JSON.stringify(payload.workspace))
      formData.append('members', JSON.stringify(payload.members))
      formData.append('productId', payload.productId.toString())
      fetcher.submit(formData, { method: 'POST' })
    }

    // 흠 이 부분은 나중에 실시간 반영을 위해서 fetch 하는 방식으로 변경
    const getMetadata = (productId: number): IntegrationAppFormMetadata => {
      const meta = integrationAppFormMetadata.find((it) => it.productId === productId)?.meta;
      return meta as unknown as IntegrationAppFormMetadata;
    };

    return (
        <IntegrationPage
            products={products}
            getMetadata={getMetadata}
            onSubmit={onSubmit}
        />
    )
}