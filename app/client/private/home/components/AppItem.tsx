import type { AppType } from "~/models/apps/types";

interface AppItemProps {
  apps: AppType;
  onGoToAppDetailPage: (appId: number) => void;
}

export const AppItem = (props: AppItemProps) => {
  const { apps, onGoToAppDetailPage  } = props;

  const { appKoreanName, appEnglishName, appLogo, registeredAt } = apps;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMonths = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );

    if (diffInMonths === 0) return "Recently";
    if (diffInMonths === 1) return "1 month ago";
    return `${diffInMonths} months ago`;
  };

  const onClick = () => {
    onGoToAppDetailPage(apps.id);
  };

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg p-4 flex gap-5 items-center" onClick={onClick}>
      <div className="w-15.5 h-15.5 overflow-hidden rounded-sm">
        <img
          src={appLogo}
          alt={appKoreanName || appEnglishName || ""}
          className="w-15.5 h-15.5 object-contain rounded-xs"
        />
      </div>

      <div className="flex flex-col">
        <span>{appKoreanName || appEnglishName || ""}</span>
        <span className="text-sm text-gray-400">
          {" "}
          {formatTimeAgo(registeredAt)}
        </span>
      </div>
    </div>
  );
};
