import { ProductCard } from "~/client/private/integration/ProductCard";
import { IntegartionProductModal } from "~/client/private/integration/IntegrationProductModal";

import type {
  PaymentHistory,
  PaymentInfo,
} from "~/models/integration/types";
import { useState } from "react";
import type { SelectedWorkspace } from "~/models/integration/types";
import type { SelectedMembers } from "~/models/integration/types";
import type { IntegrationAppFormMetadataDto } from "~/routes/dto/product";

interface IntegrationPageProps {
  metadata: IntegrationAppFormMetadataDto[];
  onSubmit: (payload: {
    workspace: SelectedWorkspace;
    members: SelectedMembers[];
    productId: number;
    paymentInfo: PaymentInfo;
    paymentHistory: PaymentHistory[];
  }) => void;
}

export default function IntegrationPage(props: IntegrationPageProps) {
  const { metadata, onSubmit } = props;
  const [open, setOpen] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState<IntegrationAppFormMetadataDto | null>(null);

  return (
    <div className="h-full w-full p-8">
      <div className="max-w-6xl ml-4">
        <div className="mb-8">
          <h1 className="mt-4 ml-16 text-2xl font-semibold mb-2">
            SaaS 연동 앱
          </h1>
          <p className="ml-16 text-gray-400">SaaS 연동 앱을 검색해주세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-12">
          {metadata.map((metadata, index: number) => (
            <ProductCard
              key={index}
              appInfo={metadata.product}
              onOpen={(pid) => {
                setSelectedMetadata(metadata);
                setOpen(true);
              }}
            />
          ))}
        </div>
        {selectedMetadata && (
        <IntegartionProductModal
            open={open}
            setOpen={setOpen}
            onSubmit={onSubmit}
            meta={selectedMetadata.meta}
            productId={selectedMetadata.product.id}
          />
        )}
        </div>
    </div>
  );
}
