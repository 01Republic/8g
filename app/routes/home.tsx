import { userContext } from "~/context";
import type { Route } from "./+types/home";
import { authMiddleware } from "~/middleware/auth";
import HomePage from "~/client/private/home/HomePage";
import { useFetcher } from "react-router";
import { useCallback, useEffect, useState } from "react";
import type { AppType } from "~/models/apps/types";
import { findAllApp } from "~/.server/services/find-all-app.service";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function action({ request, context }: Route.ActionArgs) {
  const user = context.get(userContext);

  const formData = await request.formData();
  const query = formData.get("query")?.toString();

  const apps = await findAllApp({ query: query, orgId: user!.orgId });

  return { apps };
}

export default function Home() {
  const [apps, setApps] = useState<AppType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetcher = useFetcher<typeof action>();

  const handleSearch = useCallback(
    (query: string) => {
      setIsLoading(true);
      fetcher.submit({ query }, { method: "POST" });
    },
    [fetcher],
  );

  useEffect(() => {
    if (fetcher.state === "idle") {
      setIsLoading(false);
      setApps(fetcher.data?.apps ?? []);
    } else {
      setIsLoading(true);
    }
  }, [fetcher.state, fetcher.data]);

  return <HomePage apps={apps} isLoading={isLoading} onSearch={handleSearch} />;
}
