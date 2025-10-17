import { useMemo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { z } from "zod";
import type { Block, RepeatConfig } from "scordi-extension";
import { cn } from "~/lib/utils";
import { parseZodSchema } from "~/lib/schema-parser";
import { blockLabels, fieldLabels } from "./index";
import { BlockActionHandlerModal } from "./BlockActionHandlerModal";

type GenericBlockNodeData = {
  block: Block;
  title?: string;
  schema: z.ZodTypeAny;
  repeat?: RepeatConfig;
};

type GenericBlockNodeType = Node<GenericBlockNodeData>;

export default function GenericBlockNode({
  id,
  data,
  selected,
}: NodeProps<GenericBlockNodeType>) {
  const { block, schema, repeat } = data;
  const blockName = block.name;
  const { title } = blockLabels[blockName];

  const parsedSchema = useMemo(() => parseZodSchema(schema), [schema]);

  // Repeat 뱃지 텍스트 생성
  const repeatBadgeText = useMemo(() => {
    if (!repeat) return null;
    if ("forEach" in repeat) {
      return `forEach`;
    }
    if ("count" in repeat) {
      const count = typeof repeat.count === "string" ? "변수" : repeat.count;
      return `×${count}`;
    }
    return null;
  }, [repeat]);

  return (
    <div
      className={cn(
        "border rounded-md bg-white shadow overflow-hidden",
        selected ? " border-primary-700" : "border-gray-200",
      )}
    >
      <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{title}</span>
          {repeatBadgeText && (
            <span className="px-2 py-0.5 text-xxs bg-gray-100 text-gray-700 rounded border border-gray-300 font-medium">
              {repeatBadgeText}
            </span>
          )}
        </div>

        {/* 수정 버튼 */}
        <BlockActionHandlerModal
          id={id}
          title={title}
          parsedSchema={parsedSchema}
          block={block}
          repeat={repeat}
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
