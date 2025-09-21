import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card"

interface RecentSubscriptionCardProps {
  appName: string;
  appLogo: string;
  lastUsedAt: Date;
  onClick?: () => void;
}

export function RecentSubscriptionCard({ appName, appLogo, lastUsedAt, onClick }: RecentSubscriptionCardProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMonths = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffInMonths === 0) return "Recently";
    if (diffInMonths === 1) return "1 month ago";
    return `${diffInMonths} months ago`;
  };

  return (
    <Card 
      className="aspect-square w-full bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-gray-300 p-2"
      onClick={onClick}
    >
      <div className="h-full flex flex-col gap-6">
        {/* Image area with gray background */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-200 hover:bg-gray-200 rounded-xl">
            <img src={appLogo} alt={appName} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" />
        </div>
        
        {/* Text content area */}
        <CardContent className="text-center bg-white">
          <div className="space-y-1 flex flex-col items-start py-4">
            <CardTitle className="text-lg font-semibold text-gray-900">{appName}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {formatTimeAgo(lastUsedAt)}
            </CardDescription>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
