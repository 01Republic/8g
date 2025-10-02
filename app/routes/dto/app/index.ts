export interface WorkspaceDto {
  uid: string;
  provider: string;
  content: string;
}

export interface MemberDto {
  email: string;
  status: string;
  joinDate: string;
}

export interface PaymentInfoDto {
  lastFourDigits: string;
  billingEmail: string;
  planName: string;
  billingCycle: string;
  price: string;
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
}
