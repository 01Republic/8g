import { useMemo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { z } from "zod";
import type { Block } from "8g-extension";
import { cn } from "~/lib/utils";
import { parseZodSchema } from "~/lib/schema-parser";
import { blockLabels, fieldLabels } from "./index";
import { BlockActionHandlerModal } from "./BlockActionHandlerModal";

type GenericBlockNodeData = {
  block: Block;
  title?: string;
  schema: z.ZodTypeAny;
};

type GenericBlockNodeType = Node<GenericBlockNodeData>;

export default function GenericBlockNode({
  id,
  data,
  selected,
}: NodeProps<GenericBlockNodeType>) {
  const { block, schema } = data;
  const blockName = block.name;
  const { title } = blockLabels[blockName];

  const parsedSchema = useMemo(() => parseZodSchema(schema), [schema]);

  return (
    <div
      className={cn(
        "border rounded-md bg-white shadow overflow-hidden",
        selected ? " border-primary-700" : "border-gray-200"
      )}
    >
      <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-100">
        <span className="text-xs font-medium">{title}</span>

        {/* 수정 버튼 */}
        <BlockActionHandlerModal
          id={id}
          title={title}
          parsedSchema={parsedSchema}
          block={block}
        />
      </div>

      <div className="px-3 py-2 flex gap-1 flex-col">
        {Object.entries(block).map(([key, value]) => {
          if (key === "name") return null;
          if (key === "option") {
            return Object.entries(value as any).map(([optKey, optVal]) => (
              <Row
                key={`option.${optKey}`}
                label={fieldLabels[optKey] || optKey}
                value={String(optVal)}
              />
            ));
          }
          if (value === undefined || value === null || value === "")
            return null;

          const displayValue =
            typeof value === "object" ? JSON.stringify(value) : String(value);
          return (
            <Row
              key={key}
              label={fieldLabels[key] || key}
              value={displayValue}
            />
          );
        })}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        style={{ borderRadius: 4, width: 8, height: 8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ borderRadius: 4, width: 8, height: 8 }}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-10 items-center">
      <span className="text-xxs text-gray-500 whitespace-nowrap">{label}</span>
      <span className="text-sm text-gray-700 font-semibold">{value}</span>
    </div>
  );
}
