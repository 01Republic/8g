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
