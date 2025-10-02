import { authMiddleware } from "~/middleware/auth";
import { useLoaderData } from "react-router";
import { userContext } from "~/context";
import { getSubscriptionDetail } from "~/.server/services";
import AppDetailPage from "~/client/private/apps/AppDetailPage";
import type { Route } from "./+types/apps.$id";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context, params }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const appId = parseInt(params.appId, 10);

  if (isNaN(appId)) {
    throw new Response("Invalid app ID", { status: 400 });
  }

  const appDetail = await getSubscriptionDetail(appId);

  return { appDetail };
}

export default function AppDetail() {
  const { appDetail } = useLoaderData<typeof loader>();

  return <AppDetailPage appDetail={appDetail} />;
}

