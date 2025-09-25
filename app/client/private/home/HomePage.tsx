import { useEffect, useState } from "react";
import type { AppType } from "~/models/apps/types";
import { AppSearch } from "./components/AppSearch";
import { AppItemsSection } from "./components/AppItemsSection";

interface HomePageProps {
  apps: AppType[];
}

export default function HomePage(props: HomePageProps) {
  const { apps } = props;

  const [predictions, setPredictions] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setPredictions(
      apps
        .filter((app) =>
          app.appKoreanName.toLowerCase().includes(query.toLowerCase())
        )
        .map((it) => it.appKoreanName)
    );
  }, [query]);

  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex flex-col gap-12 py-40">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            어떤 앱을 쓰고 계신가요?
          </h1>
          <AppSearch
            query={query}
            onQueryChange={setQuery}
            predictions={predictions}
          />
        </section>

        <AppItemsSection apps={apps} />
      </div>
    </div>
  );
}
