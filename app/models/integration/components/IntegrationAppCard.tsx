import type { Dispatch, SetStateAction } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import type { Product } from "../../products/types/Product";

interface IntegrationAppCardProps {
  appInfo: Product
  openIntegartionModal: Dispatch<SetStateAction<boolean>>
}

export function IntegrationAppCard({ 
  appInfo,
  openIntegartionModal
}: IntegrationAppCardProps) {
  const { nameEn, nameKo, image, tagline, productTags } = appInfo;
  const category = productTags.map((tag) => tag.tag.name).join(", ") || ""

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="w-full gap-3">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={image} />
          </Avatar>
          <CardTitle className="text-lg font-semibold">
            {nameKo} / {nameEn}
          </CardTitle>
        </div>
        <Button className="px-4 py-1 text-sm" onClick={() => openIntegartionModal(true)}>
          Connect
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm leading-relaxed mb-4">
          {truncateDescription(tagline || '')}
        </CardDescription>
        <div className="text-sm text-gray-400">
          <span className="font-medium">Category:</span> {category}
        </div>
      </CardContent>
    </Card>
  )
}
