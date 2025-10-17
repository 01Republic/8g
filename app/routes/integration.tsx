import { authMiddleware } from "~/middleware/auth";
import { userContext } from "~/context";
import { useFetcher } from "react-router";
import type { Route } from "./+types/integration";
import type {
  PaymentHistory,
  PaymentInfo,
  SelectedWorkspace,
} from "~/models/integration/types";
import type { SelectedMembers } from "~/models/integration/types";
import type { AppFormMetadata } from "~/models/integration/types";
import IntegrationPage from "~/client/private/integration/IntegrationPage";
import axios from "axios";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

export async function loader({}: Route.LoaderArgs) {
  const response = await axios.get(`${BASE_URL}/8g/integration`);
  const { integrationAppFormMetadata } = response.data;
  return { integrationAppFormMetadata };
}

export async function action({ request, context }: Route.ActionArgs) {
  const user = context.get(userContext);

  const formData = await request.formData();
  const workspace = JSON.parse(formData.get("workspace")!.toString());
  const members = JSON.parse(formData.get("members")!.toString());
  const productId = parseInt(formData.get("productId")!.toString());
  const paymentInfo = JSON.parse(formData.get("paymentInfo")!.toString());
  const paymentHistory = JSON.parse(formData.get("paymentHistory")!.toString());

  const organizationId = user!.orgId;

  await axios.post(`${BASE_URL}/8g/integration`, {
    workspace,
    members,
    paymentInfo,
    paymentHistory,
    organizationId,
    productId,
  });
}

export default function Integration({ loaderData }: Route.ComponentProps) {
  const { integrationAppFormMetadata } = loaderData;
  const fetcher = useFetcher();

  const onSubmit = (payload: {
    workspace: SelectedWorkspace;
    members: SelectedMembers[];
    productId: number;
    paymentInfo: PaymentInfo;
    paymentHistory: PaymentHistory[];
  }) => {
    const { workspace, members, productId, paymentInfo, paymentHistory } =
      payload;

    const formData = new FormData();
    formData.append("workspace", JSON.stringify(workspace));
    formData.append("members", JSON.stringify(members));
    formData.append("productId", productId.toString());
    formData.append("paymentInfo", JSON.stringify(paymentInfo));
    formData.append("paymentHistory", JSON.stringify(paymentHistory));
    fetcher.submit(formData, { method: "POST" });
  };

  return (
    <IntegrationPage
      metadata={integrationAppFormMetadata}
      onSubmit={onSubmit}
    />
  );
}
