import { AppTable } from "~/models/app/components/AppTable";
import type { Route } from "./+types/apps";
import { authMiddleware } from "~/middleware/auth";
import { useLoaderData } from "react-router";
import { userContext } from "~/context";

const { initializeDatabase } = await import("~/.server/db");
const { Subscriptions } = await import("~/.server/db/entities/Subscriptions");

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
];

export async function loader({ context }: Route.LoaderArgs) {
  await initializeDatabase();

  const user = context.get(userContext);
  const organizationId = user!.orgId;

  const subscriptions = await Subscriptions.find({
    where: {
      isActive: 1,
      organization: {
        id: organizationId
      }
    },
    relations: [
      'product',
      'currentBillingAmount', 
      'paymentPlan',
      'organization'
    ]
  });

  // 취소되거나 일시정지된 구독 필터링
  const filteredSubscriptions = subscriptions.filter(sub => 
    !['CANCELED', 'PAUSED'].includes(sub.status)
  );

  const appData = filteredSubscriptions.map((subscription: any) => ({
    id: subscription.id,
    appLogo: subscription.product?.image || "https://via.placeholder.com/40",
    appKoreanName: subscription.alias || subscription.product?.nameKo || "Unknown App",
    appEnglishName: subscription.product?.nameEn || "Unknown App",
    category: "SaaS",
    status: subscription.status,
    paidMemberCount: subscription.paidMemberCount || 0,
    usedMemberCount: subscription.usedMemberCount || 0,
    nextBillingDate: subscription.nextBillingDate,
    nextBillingAmount: subscription.nextBillingAmount || 0,
    billingCycleType: subscription.billingCycleType,
    pricingModel: subscription.pricingModel,
    connectStatus: subscription.connectStatus
  }));

  return { apps: appData };
}
  
export default function Apps() {
    const { apps } = useLoaderData<typeof loader>();
    
    return (
        <div className="h-full w-full p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Apps</h1>
                <AppTable apps={apps} />
            </div>
        </div>
    )
}