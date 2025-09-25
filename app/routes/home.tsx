import { userContext } from "~/context";
import type { Route } from "./+types/home";
import { authMiddleware } from "~/middleware/auth";
import { initializeDatabase } from "~/.server/db/config";
import { Subscriptions } from "~/.server/db/entities/Subscriptions";
import HomePage from "~/client/private/home/HomePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext); // Guaranteed to exist

  await initializeDatabase();
  const subscriptions = await Subscriptions.find({
    where: {
      organization: {
        id: user!.orgId,
      },
    },
    order: {
      registeredAt: "DESC",
    },
    relations: [
      "product",
      "currentBillingAmount",
      "paymentPlan",
      "organization",
    ],
  });

  // TODO: 나중에 mapper 함수나 따로 빼기
  return {
    user,
    apps: subscriptions.map((subscription: any) => ({
      id: subscription.id,
      appLogo: subscription.product?.image || "https://via.placeholder.com/40",
      appKoreanName:
        subscription.alias || subscription.product?.nameKo || "Unknown App",
      appEnglishName: subscription.product?.nameEn || "Unknown App",
      category: "SaaS",
      status: subscription.status,
      paidMemberCount: subscription.paidMemberCount || 0,
      usedMemberCount: subscription.usedMemberCount || 0,
      nextBillingDate: subscription.nextBillingDate,
      nextBillingAmount: subscription.nextBillingAmount || 0,
      billingCycleType: subscription.billingCycleType,
      pricingModel: subscription.pricingModel,
      connectStatus: subscription.connectStatus,
    })),
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { apps } = loaderData;

  return <HomePage apps={apps} />;
}
