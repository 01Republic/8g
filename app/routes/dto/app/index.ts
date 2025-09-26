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
  query: string | undefined;
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

export interface ProductDto {
  id: number;
  nameKo: string;
  nameEn: string;
  tagline: string | null;
  image: string;
  productTags: Array<{
    tag: {
      name: string;
    };
  }>;
}

export interface IntegrationAppFormMetadataDto {
  id: number;
  productId: number;
  meta: Record<string, unknown>;
  isActive: boolean;
}

export interface FindActiveIntegrationProductsResponseDto {
  products: ProductDto[];
  integrationAppFormMetadata: IntegrationAppFormMetadataDto[];
}
