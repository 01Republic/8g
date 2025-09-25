export type AppType = {
    id: number;
    appLogo: string;
    appKoreanName: string;
    appEnglishName: string;
    category: string;
    status: string;
    paidMemberCount: number;
    usedMemberCount: number;
    nextBillingDate: Date | null;
    nextBillingAmount: number;
    billingCycleType: string;
    pricingModel: string;
    connectStatus: string;
}