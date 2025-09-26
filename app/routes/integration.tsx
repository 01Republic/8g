import { authMiddleware } from "~/middleware/auth";
import { userContext } from "~/context";
import { useFetcher } from "react-router";
import type { Route } from "./+types/integration";
import type { SelectedWorkspace } from "~/models/integration/types";
import type { SelectedMembers } from "~/models/integration/types";
import type { AppFormMetadata } from "~/models/integration/types";
import IntegrationPage from "~/client/private/integration/IntegrationPage";
import { integrateApp } from "~/.server/services/integrate-app.service";
import { findActiveIntegrationProducts } from "~/.server/services/find-active-integration-products.service";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({}: Route.LoaderArgs) {
  return await findActiveIntegrationProducts();
}

export async function action({ request, context }: Route.ActionArgs) {
  const user = context.get(userContext);

  const formData = await request.formData();
  const workspace = JSON.parse(formData.get("workspace")!.toString());
  const members = JSON.parse(formData.get("members")!.toString());
  const productId = parseInt(formData.get("productId")!.toString());
  const organizationId = user!.orgId;

  await integrateApp({
    workspace,
    members,
    organizationId,
    productId,
  });
}

export default function Integration({ loaderData }: Route.ComponentProps) {
  const { products, integrationAppFormMetadata } = loaderData;
  const fetcher = useFetcher();

  const onSubmit = (payload: {
    workspace: SelectedWorkspace;
    members: SelectedMembers[];
    productId: number;
  }) => {
    const { workspace, members, productId } = payload;

    const formData = new FormData();
    formData.append("workspace", JSON.stringify(workspace));
    formData.append("members", JSON.stringify(members));
    formData.append("productId", productId.toString());
    fetcher.submit(formData, { method: "POST" });
  };

  // 흠 이 부분은 나중에 실시간 반영을 위해서 fetch 하는 방식으로 변경
  const getMetadata = (productId: number): AppFormMetadata => {
    const meta = integrationAppFormMetadata.find(
      (it) => it.productId === productId,
    )?.meta;
    return meta as unknown as AppFormMetadata;
  };

  return (
    <IntegrationPage
      products={products}
      getMetadata={getMetadata}
      onSubmit={onSubmit}
    />
  );
}
