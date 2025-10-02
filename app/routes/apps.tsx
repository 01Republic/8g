import type { Route } from "./+types/apps";
import { authMiddleware } from "~/middleware/auth";
import { useLoaderData } from "react-router";
import { userContext } from "~/context";
import AppsPage from "~/client/private/apps/AppsPage";
import { findAllApp } from "~/.server/services";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const organizationId = user!.orgId;

  const apps = await findAllApp({
    orgId: organizationId,
  });

  return { apps };
}

export default function Apps() {
  const { apps } = useLoaderData<typeof loader>();

  return <AppsPage apps={apps} />;
}
