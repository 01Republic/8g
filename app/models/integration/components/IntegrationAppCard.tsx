import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

interface IntegrationAppCardProps {
  appKoreanName: string;
  appEnglishName: string;
  appDescription: string;
  appLogo: string;
  category: string;
}

export function IntegrationAppCard({ appKoreanName, appEnglishName, appDescription, appLogo, category }: IntegrationAppCardProps) {
  const truncateDescription = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="w-full gap-3">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={appLogo} />
          </Avatar>
          <CardTitle className="text-lg font-semibold">
            {appKoreanName} / {appEnglishName}
          </CardTitle>
        </div>
        <Button className="px-4 py-1 text-sm">
          Install
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm leading-relaxed mb-4">
          {truncateDescription(appDescription)}
        </CardDescription>
        <div className="text-sm text-gray-400">
          <span className="font-medium">Models:</span> {category}
        </div>
      </CardContent>
    </Card>
  )
}
