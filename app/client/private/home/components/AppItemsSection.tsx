import type { AppType } from "~/models/apps/types";
import { AppItem } from "./AppItem";

interface AppItemsSectionProps {
  apps: AppType[];
}

export const AppItemsSection = (props: AppItemsSectionProps) => {
  const { apps } = props;

  return (
    <section className="flex flex-col gap-4">
      {apps.length > 0 && (
        <span className="text-sm text-gray-600 font-light">최근 등록한 앱</span>
      )}

      <div className="grid grid-cols-2 gap-6">
        {apps.map((app) => (
          <AppItem key={app.id} apps={app} />
        ))}
      </div>
    </section>
  );
};
