import { ProductCard } from "~/client/private/integration/ProductCard";
import { IntegartionProductModal } from "~/client/private/integration/IntegrationProductModal";

import type { AppFormMetadata } from "~/models/integration/types";
import { useState } from "react";
import type { SelectedWorkspace } from "~/models/integration/types";
import type { SelectedMembers } from "~/models/integration/types";
import type { Product } from "~/models/integration/types";

interface IntegrationPageProps {
  products: Product[];
  getMetadata: (productId: number) => AppFormMetadata;
  onSubmit: (payload: {
    workspace: SelectedWorkspace;
    members: SelectedMembers[];
    productId: number;
  }) => void;
}

export default function IntegrationPage(props: IntegrationPageProps) {
  const { products, getMetadata, onSubmit } = props;
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState<number>(products[0]?.id || 1);

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
          {products.map((app, index: number) => (
            <ProductCard
              key={index}
              appInfo={app}
              onOpen={(pid) => {
                setProductId(pid);
                setOpen(true);
              }}
            />
          ))}
        </div>
        {getMetadata(productId) && (
          <IntegartionProductModal
            open={open}
            setOpen={setOpen}
            onSubmit={onSubmit}
            meta={getMetadata(productId)}
            productId={productId}
          />
        )}
      </div>
    </div>
  );
}
