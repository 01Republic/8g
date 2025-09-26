import type { AppType } from "~/models/apps/types";
import { AppItem } from "./AppItem";

interface AppItemsSectionProps {
  apps: AppType[];
  isLoading: boolean;
}

export const AppItemsSection = (props: AppItemsSectionProps) => {
  const { apps, isLoading } = props;
  const hasApps = apps.length > 0;
  const showItems = hasApps && !isLoading;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 font-light">나의 구독 앱...</span>
      </div>

      <div className="relative h-100">
        <div className="absolute inset-0 rounded-2xl">
          <div className="h-full overflow-y-auto rounded-2xl p-4">
            {showItems ? (
              <div className="grid grid-cols-2 gap-6">
                {apps.map((app) => (
                  <AppItem key={app.id} apps={app} />
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  검색 결과가 없습니다.
                </div>
              )
            )}
          </div>
          {isLoading && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <span className="h-11 w-11 animate-spin rounded-full border-[3px] border-gray-200 border-t-transparent border-b-transparent">
                <span className="sr-only">Loading</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
