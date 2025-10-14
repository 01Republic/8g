import { useEffect, useState } from "react";
import type { AppType } from "~/models/apps/types";
import { AppSearch } from "./components/AppSearch";
import { AppItemsSection } from "./components/AppItemsSection";

interface HomePageProps {
  apps: AppType[];
  isLoading: boolean;
  onSearch: (query: string) => void;
  onGoToAppDetailPage: (appId: number) => void;
}

export default function HomePage(props: HomePageProps) {
  const { apps, isLoading, onSearch, onGoToAppDetailPage } = props;

  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-4">
      <div className="w-full max-w-4xl flex flex-col gap-12 py-40">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            어떤 앱을 쓰고 계신가요?
          </h1>
          <AppSearch query={query} onQueryChange={setQuery} />
        </section>

        <AppItemsSection
          apps={apps}
          isLoading={isLoading}
          onGoToAppDetailPage={onGoToAppDetailPage}
        />
      </div>
    </div>
  );
}
