import { useState } from "react";
import { useReactFlow } from "@xyflow/react";
import type { Block } from "8g-extension";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { type ParsedSchema } from "~/lib/schema-parser";
import { StringFieldBlock } from "./fieldBlock/StringFieldBlock";
import { NumberFieldBlock } from "./fieldBlock/NumberFieldBlock";
import { BooleanFieldBlock } from "./fieldBlock/BooleanFieldBlock";
import { EnumFieldBlock } from "./fieldBlock/EnumFieldBlock";
import { ArrayFieldBlock } from "./fieldBlock/ArrayFieldBlock";
import { TextFilterFieldBlock } from "./fieldBlock/TextFilterFieldBlock";
import { OptionFieldBlock } from "./fieldBlock/OptionFieldBlock";
import { SchemaDefinitionFieldBlock } from "./fieldBlock/SchemaDefinitionFieldBlock";
import { SourceDataFieldBlock } from "./fieldBlock/SourceDataFieldBlock";

interface BlockActionHandlerModalProps {
  id: string;
  title: string;
  block: Block;
  parsedSchema: ParsedSchema;
}

export const BlockActionHandlerModal = (
  props: BlockActionHandlerModalProps
) => {
  const { id, title, parsedSchema, block } = props;

  const { setNodes } = useReactFlow();
  const blockName = block.name;
  const [open, setOpen] = useState(false);

  // Form state - 동적으로 생성
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    parsedSchema.fields.forEach((field) => {
      if (field.name === "name") {
        initial[field.name] = blockName; // literal value
      } else if (field.name === "option" && field.type === "object") {
        initial[field.name] = (block as any).option || {};
      } else {
        initial[field.name] =
          (block as any)[field.name] ?? field.defaultValue ?? "";
      }
    });
    return initial;
  });

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      // Reset form data from block
      const newFormData: Record<string, any> = {};
      parsedSchema.fields.forEach((field) => {
        if (field.name === "name") {
          newFormData[field.name] = blockName;
        } else if (field.name === "option" && field.type === "object") {
          newFormData[field.name] = (block as any).option || {};
        } else {
          newFormData[field.name] =
            (block as any)[field.name] ?? field.defaultValue ?? "";
        }
      });
      setFormData(newFormData);
    }
  };

  const handleSave = () => {
    const nextBlock: any = {
      ...block,
      name: blockName,
    };

    // Apply form data to block
    parsedSchema.fields.forEach((field) => {
      if (field.name === "name") return; // Skip name, it's literal

      const value = formData[field.name];

      if (field.name === "option" && field.type === "object") {
        nextBlock.option = value;
      } else if (value === "" || value === undefined) {
        // Skip empty values for optional fields
        if (!field.optional) {
          nextBlock[field.name] = value;
        }
      } else {
        nextBlock[field.name] = value;
      }
    });

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        return {
          ...n,
          data: {
            ...n.data,
            block: nextBlock,
          },
        } as any;
      })
    );
    setOpen(false);
  };

  const updateFormField = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const updateOptionField = (optionKey: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      option: {
        ...prev.option,
        [optionKey]: value,
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="xxs"
          onClick={() => console.log(parsedSchema)}
        >
          수정
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title} 편집</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-4">
          {(() => {
            console.log('🔍 Parsed Schema Fields:', parsedSchema.fields);
            return null;
          })()}
          {parsedSchema.fields.map((field) => {
            if (field.name === "name") return null;

            if (field.name === "option" && field.type === "object") {
              return (
                <OptionFieldBlock
                  field={field}
                  formData={formData}
                  updateOptionField={updateOptionField}
                />
              );
            }

            // Render field based on type
            
            // schemaDefinition은 독립적으로 처리 (discriminated union이라 field.type이 "object"가 아닐 수 있음)
            if (field.name === "schemaDefinition") {
              return (
                <SchemaDefinitionFieldBlock
                  field={field}
                  formData={formData}
                  updateFormField={updateFormField}
                />
              );
            }

            if (field.type === "string") {
              // sourceData는 이전 노드 선택 드롭다운으로
              if (field.name === "sourceData") {
                return (
                  <SourceDataFieldBlock
                    field={field}
                    formData={formData}
                    updateFormField={updateFormField}
                    currentNodeId={id}
                  />
                );
              }
              return (
                <StringFieldBlock
                  field={field}
                  formData={formData}
                  updateFormField={updateFormField}
                />
              );
            } else if (field.type === "number") {
              return (
                <NumberFieldBlock
                  field={field}
                  formData={formData}
                  updateFormField={updateFormField}
                />
              );
            } else if (field.type === "boolean") {
              return (
                <BooleanFieldBlock
                  field={field}
                  formData={formData}
                  updateFormField={updateFormField}
                />
              );
            } else if (field.type === "enum") {
              return (
                <EnumFieldBlock
                  field={field}
                  formData={formData}
                  updateFormField={updateFormField}
                />
              );
            } else if (
              field.type === "array" &&
              field.arrayItemType === "string"
            ) {
              return (
                <ArrayFieldBlock
                  field={field}
                  formData={formData}
                  updateFormField={updateFormField}
                />
              );
            } else if (field.type === "object") {
              // For textFilter in EventClickBlock
              if (field.name === "textFilter") {
                return (
                  <TextFilterFieldBlock
                    field={field}
                    formData={formData}
                    updateFormField={updateFormField}
                  />
                );
              }
            }

            return null;
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
