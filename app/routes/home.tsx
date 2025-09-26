import { userContext } from "~/context";
import type { Route } from "./+types/home";
import { authMiddleware } from "~/middleware/auth";
import { initializeDatabase } from "~/.server/db/config";
import { Subscriptions } from "~/.server/db/entities/Subscriptions";
import HomePage from "~/client/private/home/HomePage";
import { Like } from "typeorm";
import { useFetcher } from "react-router";
import { useCallback, useEffect, useState } from "react";
import type { AppType } from "~/models/apps/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function action({ request, context }: Route.ActionArgs) {
  const user = context.get(userContext);
  const formData = await request.formData();
  const query = formData.get("query");

  function isKorean(str: string) {
    const pattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  
    return pattern.test(str);
  }
  
  function isEnglish(str: string) {
    const pattern = /[a-zA-Z]/;
  
    return pattern.test(str);
  }

  const where = {
    organization: {
      id: user!.orgId,
    },
    product: {},
  };

  if (query) {
    where.product = {
      searchText: Like(`%${query as string}%`),
      ...(isKorean(query as string) ? { nameKo: Like(`%${query as string}%`) } : {}),
      ...(isEnglish(query as string) ? { nameEn: Like(`%${query as string}%`) } : {}),
    };
  }

  await initializeDatabase();
  const subscriptions = await Subscriptions.find({
    where,
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

  return {
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

export default function Home() {
  const [apps, setApps] = useState<AppType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetcher = useFetcher<typeof action>();

  const handleSearch = useCallback(
    (query: string) => {
      setIsLoading(true);
      fetcher.submit({ query }, { method: "POST" });
    },
    [fetcher]
  );

  useEffect(() => {
    if (fetcher.state === "idle") {
      setIsLoading(false);
      setApps(fetcher.data?.apps ?? []);
    } else {
      setIsLoading(true);
    }
  }, [fetcher.state, fetcher.data]);

  return <HomePage apps={apps} isLoading={isLoading} onSearch={handleSearch} />;
}
