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

export interface RegisterAppDto {
  workspace: WorkspaceDto;
  members: MemberDto[];
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
