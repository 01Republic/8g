import { Like } from "typeorm";
import type { AppResponseDto, FindAllAppDto } from "~/routes/dto/app";
import { initializeDatabase, Subscriptions } from "../db";
import { isKorean, isEnglish } from "../utils";

export async function findAllApp({
  query,
  orgId,
}: FindAllAppDto): Promise<AppResponseDto[]> {
  const where = {
    organization: {
      id: orgId,
    },
    product: createProductCondition(query),
  };

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

  return subscriptions.map((subscription: any) => ({
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
  }));
}

const createProductCondition = (query?: string) => {
  if (!query) return {};

  const conditions = {
    searchText: Like(`%${query}%`),
  };

  // 언어별 조건 추가
  if (isKorean(query)) {
    Object.assign(conditions, { nameKo: Like(`%${query}%`) });
  }

  if (isEnglish(query)) {
    Object.assign(conditions, { nameEn: Like(`%${query}%`) });
  }

  return conditions;
};
