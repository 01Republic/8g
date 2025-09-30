import React from "react";
import {
  Handle,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
} from "@xyflow/react";
import type { Block } from "8g-extension";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { parseZodSchema } from "~/lib/schema-parser";
import { blockLabels, fieldLabels } from "./index";
import type { z } from "zod";

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
  const blockInfo = blockLabels[blockName] || { title: blockName, description: "" };
  const title = data.title ?? blockInfo.title;
  
  const { setNodes } = useReactFlow();
  const [open, setOpen] = React.useState(false);
  
  // Parse schema to get fields
  const parsedSchema = React.useMemo(() => parseZodSchema(schema), [schema]);
  
  // Form state - 동적으로 생성
  const [formData, setFormData] = React.useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    parsedSchema.fields.forEach((field) => {
      if (field.name === 'name') {
        initial[field.name] = blockName; // literal value
      } else if (field.name === 'option' && field.type === 'object') {
        initial[field.name] = (block as any).option || {};
      } else {
        initial[field.name] = (block as any)[field.name] ?? field.defaultValue ?? '';
      }
    });
    return initial;
  });

  const onOpenChange = (next: boolean) => {
    if (next) {
      // Reset form data from block
      const newFormData: Record<string, any> = {};
      parsedSchema.fields.forEach((field) => {
        if (field.name === 'name') {
          newFormData[field.name] = blockName;
        } else if (field.name === 'option' && field.type === 'object') {
          newFormData[field.name] = (block as any).option || {};
        } else {
          newFormData[field.name] = (block as any)[field.name] ?? field.defaultValue ?? '';
        }
      });
      setFormData(newFormData);
    }
    setOpen(next);
  };

  const handleSave = () => {
    const nextBlock: any = {
      ...block,
      name: blockName,
    };

    // Apply form data to block
    parsedSchema.fields.forEach((field) => {
      if (field.name === 'name') return; // Skip name, it's literal
      
      const value = formData[field.name];
      
      if (field.name === 'option' && field.type === 'object') {
        nextBlock.option = value;
      } else if (value === '' || value === undefined) {
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
    <div
      style={{
        border: selected ? "2px solid #4f46e5" : "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#ffffff",
        minWidth: 220,
        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
        <span
          style={{
            fontSize: 10,
            color: "#6b7280",
            background: "#f3f4f6",
            padding: "2px 6px",
            borderRadius: 999,
          }}
        >
          {blockName}
        </span>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{title} 편집</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              {parsedSchema.fields.map((field) => {
                // Skip name field (literal)
                if (field.name === 'name') return null;
                
                // Special handling for 'option' object
                if (field.name === 'option' && field.type === 'object') {
                  return (
                    <div key={field.name} className="grid gap-2">
                      <Label>옵션</Label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.option?.waitForSelector ?? false}
                          onChange={(e) => updateOptionField('waitForSelector', e.target.checked)}
                        />
                        <span>셀렉터 대기</span>
                      </label>
                      <div className="grid gap-2">
                        <Label htmlFor="waitSelectorTimeout">대기 시간 (ms)</Label>
                        <Input
                          id="waitSelectorTimeout"
                          type="number"
                          value={formData.option?.waitSelectorTimeout ?? ''}
                          onChange={(e) => updateOptionField('waitSelectorTimeout', e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="2000"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.option?.multiple ?? false}
                          onChange={(e) => updateOptionField('multiple', e.target.checked)}
                        />
                        <span>다중 선택</span>
                      </label>
                    </div>
                  );
                }

                const label = fieldLabels[field.name] || field.name;

                // Render field based on type
                if (field.type === 'string') {
                  return (
                    <div key={field.name} className="grid gap-2">
                      <Label htmlFor={field.name}>{label}</Label>
                      <Input
                        id={field.name}
                        value={formData[field.name] ?? ''}
                        onChange={(e) => updateFormField(field.name, e.target.value)}
                        placeholder={field.defaultValue}
                      />
                    </div>
                  );
                } else if (field.type === 'number') {
                  return (
                    <div key={field.name} className="grid gap-2">
                      <Label htmlFor={field.name}>{label}</Label>
                      <Input
                        id={field.name}
                        type="number"
                        value={formData[field.name] ?? ''}
                        onChange={(e) => updateFormField(field.name, e.target.value ? Number(e.target.value) : '')}
                        placeholder={field.defaultValue}
                      />
                    </div>
                  );
                } else if (field.type === 'boolean') {
                  return (
                    <div key={field.name} className="grid gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData[field.name] ?? false}
                          onChange={(e) => updateFormField(field.name, e.target.checked)}
                        />
                        <span>{label}</span>
                      </label>
                    </div>
                  );
                } else if (field.type === 'enum') {
                  return (
                    <div key={field.name} className="grid gap-2">
                      <Label>{label}</Label>
                      <Select
                        value={formData[field.name] ?? ''}
                        onValueChange={(v) => updateFormField(field.name, v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`${label} 선택`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.enumValues?.map((val) => (
                            <SelectItem key={val} value={val}>
                              {val}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                } else if (field.type === 'array' && field.arrayItemType === 'string') {
                  // Array of strings - comma separated input
                  const arrayValue = Array.isArray(formData[field.name]) 
                    ? formData[field.name].join(', ') 
                    : '';
                  return (
                    <div key={field.name} className="grid gap-2">
                      <Label htmlFor={field.name}>{label}</Label>
                      <Input
                        id={field.name}
                        value={arrayValue}
                        onChange={(e) => {
                          const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          updateFormField(field.name, arr.length > 0 ? arr : undefined);
                        }}
                        placeholder="쉼표로 구분 (예: href, src, class)"
                      />
                    </div>
                  );
                } else if (field.type === 'union') {
                  // For textFilter in EventClickBlock
                  if (field.name === 'textFilter') {
                    return (
                      <div key={field.name} className="grid gap-2">
                        <Label>텍스트 필터</Label>
                        <Input
                          placeholder="필터할 텍스트"
                          value={formData[field.name]?.text ?? ''}
                          onChange={(e) => updateFormField(field.name, {
                            ...formData[field.name],
                            text: e.target.value,
                            mode: formData[field.name]?.mode ?? 'exact',
                          })}
                        />
                        <Select
                          value={formData[field.name]?.mode ?? 'exact'}
                          onValueChange={(v) => updateFormField(field.name, {
                            ...formData[field.name],
                            mode: v,
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exact">정확히 일치</SelectItem>
                            <SelectItem value="contains">포함</SelectItem>
                            <SelectItem value="startsWith">시작</SelectItem>
                            <SelectItem value="endsWith">끝</SelectItem>
                            <SelectItem value="regex">정규식</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
      </div>

      <div style={{ padding: 12, display: "grid", rowGap: 8 }}>
        {Object.entries(block).map(([key, value]) => {
          if (key === 'name') return null;
          if (key === 'option') {
            return Object.entries(value as any).map(([optKey, optVal]) => (
              <Row key={`option.${optKey}`} label={fieldLabels[optKey] || optKey} value={String(optVal)} />
            ));
          }
          if (value === undefined || value === null || value === '') return null;
          
          const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
          return <Row key={key} label={fieldLabels[key] || key} value={displayValue} />;
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "100px 1fr",
        columnGap: 10,
        alignItems: "center",
      }}
    >
      <span style={{ fontSize: 11, color: "#6b7280" }}>{label}</span>
      <span style={{ fontSize: 12, color: "#111827", wordBreak: "break-all" }}>
        {value}
      </span>
    </div>
  );
}
