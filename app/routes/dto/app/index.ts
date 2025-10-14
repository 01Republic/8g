export interface WorkspaceDto {
  uid: string;
  provider: string;
  content: string;
}

export interface MemberDto {
  profileImgUrl: string | undefined;
  name: string;
  email: string;
  joinDate: string;
}

export interface PaymentInfoDto {
  cardNumber: string;
  billingEmail: string;
  nextPaymentDate: string;
  nextPaymentAmount: string;
  currentPaymentAmount: string;
  subscriptionPlanName: string;
  billingCycleType: string;
}

export interface PaymentHistoryDto {
  date: string;
  amount: string;
  invoiceUrl: string;
}

export interface RegisterAppDto {
  workspace: WorkspaceDto;
  members: MemberDto[];
  paymentInfo: PaymentInfoDto;
  paymentHistory: PaymentHistoryDto[];
  organizationId: number;
  productId: number;
}

export interface FindAllAppDto {
  query?: string;
  orgId: number;
}

export interface RegisterAppResponseDto {
  subscriptionId: number;
  savedSeats: number;
}

export interface AppResponseDto {
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
  registeredAt: Date;
}

export interface AppDetailResponseDto {
  id: number;
  appLogo: string;
  appKoreanName: string;
  appEnglishName: string;
  category: string;
  status: string;
  connectStatus: string;

  workspace: {
    id: number;
    displayName: string;
    profileImageUrl: string | null;
    billingEmail: string | null;
    publicEmail: string | null;
    description: string | null;
  } | null;

  paidMemberCount: number;
  usedMemberCount: number;

  seats: Array<{
    id: number;
    name: string;
    email: string;
    status: string;
    isPaid: boolean;
    startAt: Date | null;
    finishAt: Date | null;
    profileImageUrl: string | null;
  }>;

  paymentInfo: {
    creditCard: {
      lastFourDigits: string;
      cardName: string;
    } | null;
    planName: string;
    billingCycleType: string;
    pricingModel: string;
    currentBillingAmount: number;
    currency: string;
  };

  registeredAt: Date | null;
  nextBillingDate: Date | null;
  nextBillingAmount: number;
  lastPaidAt: Date | null;
  startAt: string | null;
  finishAt: string | null;

  billingHistories: Array<{
    id: number;
    paidAt: Date | null;
    issuedAt: Date;
    amount: number;
    currency: string;
    invoiceUrl: string | null;
    paymentMethod: string;
  }>;

  description: string | null;
  connectMethod: string;
  utilizationRate: string;
  costPerUser: number;
  totalTeamMemberCount: number;
}
