import type { FindActiveIntegrationProductsResponseDto, IntegrationAppFormMetadataDto } from "~/routes/dto/product";
import { initializeDatabase } from "~/.server/db";
import { IntegrationAppFormMetadata } from "~/.server/db/entities/IntegrationAppFormMetadata";
import { Products } from "~/.server/db/entities/Products";

export async function findActiveIntegrationProducts(): Promise<FindActiveIntegrationProductsResponseDto> {
  await initializeDatabase();

  // 활성화된 통합 앱 메타데이터 조회
  const integrationAppFormMetadata = await IntegrationAppFormMetadata.find({
    where: { isActive: true },
  });

  // 메타데이터가 없으면 빈 결과 반환
  if (integrationAppFormMetadata.length === 0) {
    return {
      integrationAppFormMetadata: [],
    };
  }

  // 제품 조회 쿼리 실행
  const productIds = integrationAppFormMetadata.map((item) => item.productId);

  const products = await Products.createQueryBuilder("product")
    .leftJoinAndSelect("product.productTags", "productTag")
    .leftJoinAndSelect("productTag.tag", "tag")
    .andWhere("product.id IN (:...productIds)", { productIds })
    .getMany();

  return {
    integrationAppFormMetadata: integrationAppFormMetadata.map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId),
    })) as IntegrationAppFormMetadataDto[],
  };
}
