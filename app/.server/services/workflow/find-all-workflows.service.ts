import type { FindOptionsOrder } from "typeorm";
import { initializeDatabase } from "~/.server/db";
import { IntegrationAppWorkflowMetadata } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";
import { FindAllQueryDto } from "~/.server/dto/FindAllQueryDto";
import { Paginated } from "~/.server/dto/paginated.dto";

export class FindAllIntegrationAppWorkflowQueryDto extends FindAllQueryDto<IntegrationAppWorkflowMetadata> {
  //
}

export async function findAllWorkflows(
  query: FindAllIntegrationAppWorkflowQueryDto,
  token?: string,
): Promise<Paginated<IntegrationAppWorkflowMetadata>> {
  // token is no longer required since we query DB directly; keep for compatibility
  void token;

  const {
    page = 1,
    itemsPerPage = 10,
    where,
    order,
    relations = [],
  } = query;

  await initializeDatabase();

  const repository = IntegrationAppWorkflowMetadata.getRepository();

  const effectiveOrder: FindOptionsOrder<IntegrationAppWorkflowMetadata> =
    order && Object.keys(order).length > 0
      ? order
      : { id: "DESC" as const };

  const [items, totalItemCount] = await repository.findAndCount({
    where,
    order: effectiveOrder,
    relations: relations.length > 0 ? relations : undefined,
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
  });

  return new Paginated(
    items,
    totalItemCount,
    page,
    itemsPerPage,
  );
}
