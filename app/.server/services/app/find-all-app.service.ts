import { Like } from "typeorm";
import type { AppDetailResponseDto, AppResponseDto, FindAllAppDto } from "~/routes/dto/app";
import { initializeDatabase, Subscriptions } from "~/.server/db";
import { isKorean, isEnglish } from "~/.server/utils";

export async function findAllApp({
  query,
  orgId,
}: FindAllAppDto): Promise<AppResponseDto[]> {
  const where = {
    isActive: 1,
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
      "creditCard",
      "billingHistories",
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
    registeredAt: subscription.registeredAt,
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

export async function getSubscriptionDetail(id: number): Promise<AppDetailResponseDto> {
  await initializeDatabase();
  
  const subscription = await Subscriptions.findOne({
    where: {
      id: id,
    },
    relations: [
      "product",
      "currentBillingAmount",
      "paymentPlan",
      "organization",
      "organization.teamMembers",
      "creditCard",
      "billingHistories",
      "billingHistories.payAmount",
      "workspace",
      "workspace.product",
      "subscriptionSeats",
      "subscriptionSeats.teamMember",
    ],
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  return {
    id: subscription.id,
    appLogo: subscription.product?.image || "https://via.placeholder.com/40",
    appKoreanName: subscription.alias || subscription.product?.nameKo || "Unknown App",
    appEnglishName: subscription.product?.nameEn || "Unknown App",
    category: "SaaS",
    status: subscription.status,
    connectStatus: subscription.connectStatus,
    
    // Workspace info
    workspace: subscription.workspace ? {
      id: subscription.workspace.id,
      displayName: subscription.workspace.displayName,
      profileImageUrl: subscription.workspace.profileImageUrl,
      billingEmail: subscription.workspace.billingEmail,
      publicEmail: subscription.workspace.publicEmail,
      description: subscription.workspace.description,
    } : null,
    
    // Member stats
    paidMemberCount: subscription.paidMemberCount || 0,
    usedMemberCount: subscription.usedMemberCount || 0,
    
    // Members list
    seats: subscription.subscriptionSeats?.map((seat: any) => ({
      id: seat.id,
      name: seat.teamMember?.name || "Unknown",
      email: seat.teamMember?.email || "",
      status: seat.status,
      isPaid: seat.isPaid === 1,
      startAt: seat.startAt,
      finishAt: seat.finishAt,
      profileImageUrl: seat.teamMember?.profileImageUrl || null,
    })) || [],
    
    // Payment info
    paymentInfo: {
      creditCard: subscription.creditCard ? {
        lastFourDigits: subscription.creditCard.number_4 || "",
        cardName: subscription.creditCard.name || "",
      } : null,
      planName: subscription.paymentPlan?.name || "N/A",
      billingCycleType: subscription.billingCycleType,
      pricingModel: subscription.pricingModel,
      currentBillingAmount: subscription.currentBillingAmount?.amount || 0,
      currency: subscription.currentBillingAmount?.code || "KRW",
    },
    
    // Billing dates
    registeredAt: subscription.registeredAt,
    nextBillingDate: subscription.nextBillingDate,
    nextBillingAmount: subscription.nextBillingAmount || 0,
    lastPaidAt: subscription.lastPaidAt,
    startAt: subscription.startAt,
    finishAt: subscription.finishAt,
    
    // Billing history
    billingHistories: subscription.billingHistories?.map((history: any) => ({
      id: history.id,
      paidAt: history.paidAt,
      issuedAt: history.issuedAt,
      amount: history.payAmount?.amount || 0,
      currency: history.payAmount?.code || "KRW",
      invoiceUrl: history.invoiceUrl,
      paymentMethod: history.paymentMethod,
    })) || [],
    
    // Additional info
    description: subscription.desc,
    connectMethod: subscription.connectMethod,
    utilizationRate: subscription.paidMemberCount > 0
      ? ((subscription.usedMemberCount / subscription.organization.teamMembers.length) * 100).toFixed(
          1
        )
      : "0",
    costPerUser: subscription.usedMemberCount > 0
      ? subscription.currentBillingAmount?.amount / subscription.usedMemberCount
      : 0,
    totalTeamMemberCount: subscription.organization.teamMembers.length,
  };
}