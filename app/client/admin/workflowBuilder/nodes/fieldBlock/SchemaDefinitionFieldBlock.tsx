import { Label } from "~/components/ui/label";
import { FieldBlockContentBox } from "./FieldBlockContentBox";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { ParsedField } from "~/lib/schema-parser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface SchemaDefinitionFieldBlockProps {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
}

export const SchemaDefinitionFieldBlock = (
  props: SchemaDefinitionFieldBlockProps
) => {
  const { field, formData, updateFormField } = props;
  const { name } = field;

  const schemaValue = formData[name] || { type: "object", shape: {} };
  const rootType = schemaValue.type || "object";

  const updateRootType = (newType: string) => {
    if (newType === "object") {
      updateFormField(name, {
        type: "object",
        shape: {},
      });
    } else {
      // array
      updateFormField(name, {
        type: "array",
        items: { type: "object", shape: {} },
      });
    }
  };

  if (rootType === "array") {
    return <ArraySchemaFieldBlock field={field} formData={formData} updateFormField={updateFormField} updateRootType={updateRootType} />;
  }

  // rootType === "object"
  return <ObjectSchemaFieldBlock field={field} formData={formData} updateFormField={updateFormField} updateRootType={updateRootType} />;
};

// Object 스키마 편집
function ObjectSchemaFieldBlock({
  field,
  formData,
  updateFormField,
  updateRootType,
}: {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
  updateRootType: (type: string) => void;
}) {
  const { name } = field;
  const schemaValue = formData[name] || { type: "object", shape: {} };
  const shape = schemaValue.shape || {};
  const entries = Object.entries(shape);

  const addField = () => {
    const newKey = `field${entries.length + 1}`;
    updateFormField(name, {
      type: "object",
      shape: {
        ...shape,
        [newKey]: { type: "string" },
      },
    });
  };

  const removeField = (key: string) => {
    const newShape = { ...shape };
    delete newShape[key];
    updateFormField(name, {
      type: "object",
      shape: newShape,
    });
  };

  const updateFieldKey = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const newShape: Record<string, any> = {};
    Object.entries(shape).forEach(([k, v]) => {
      newShape[k === oldKey ? newKey : k] = v;
    });
    updateFormField(name, {
      type: "object",
      shape: newShape,
    });
  };

  const updateFieldType = (key: string, type: string) => {
    updateFormField(name, {
      type: "object",
      shape: {
        ...shape,
        [key]: { type },
      },
    });
  };

  return (
    <FieldBlockContentBox key={name}>
      <Label>
        <span className="whitespace-nowrap w-80 text-base">스키마 정의</span>
        <div className="flex flex-col gap-3 w-full">
          {/* 루트 타입 선택 */}
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600 w-24">데이터 타입</span>
            <Select value="object" onValueChange={updateRootType}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="object">객체 (단일)</SelectItem>
                <SelectItem value="array">배열 (여러 개)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 필드 목록 */}
          <div className="flex flex-col gap-2 w-full border-t pt-2">
            {entries.map(([key, typeObj], index) => {
              const typeValue = (typeObj as any)?.type || "string";
              return (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={key}
                    onChange={(e) => updateFieldKey(key, e.target.value)}
                    placeholder="필드 이름"
                    className="flex-1"
                  />
                  <Select
                    value={typeValue}
                    onValueChange={(v) => updateFieldType(key, v)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">문자열</SelectItem>
                      <SelectItem value="number">숫자</SelectItem>
                      <SelectItem value="boolean">불린</SelectItem>
                      <SelectItem value="array">배열</SelectItem>
                      <SelectItem value="object">객체</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeField(key)}
                    className="shrink-0"
                  >
                    삭제
                  </Button>
                </div>
              );
            })}
            <Button variant="secondary" size="sm" onClick={addField}>
              + 필드 추가
            </Button>
          </div>
        </div>
      </Label>
    </FieldBlockContentBox>
  );
}

// Array 스키마 편집
function ArraySchemaFieldBlock({
  field,
  formData,
  updateFormField,
  updateRootType,
}: {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
  updateRootType: (type: string) => void;
}) {
  const { name } = field;
  const schemaValue = formData[name] || {
    type: "array",
    items: { type: "object", shape: {} },
  };
  const items = schemaValue.items || { type: "object", shape: {} };
  const itemsType = items.type || "object";
  const shape = items.shape || {};
  const entries = Object.entries(shape);

  const updateItemsType = (newType: string) => {
    if (newType === "object") {
      updateFormField(name, {
        type: "array",
        items: { type: "object", shape: {} },
      });
    } else {
      updateFormField(name, {
        type: "array",
        items: { type: newType },
      });
    }
  };

  const addField = () => {
    const newKey = `field${entries.length + 1}`;
    updateFormField(name, {
      type: "array",
      items: {
        type: "object",
        shape: {
          ...shape,
          [newKey]: { type: "string" },
        },
      },
    });
  };

  const removeField = (key: string) => {
    const newShape = { ...shape };
    delete newShape[key];
    updateFormField(name, {
      type: "array",
      items: {
        type: "object",
        shape: newShape,
      },
    });
  };

  const updateFieldKey = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const newShape: Record<string, any> = {};
    Object.entries(shape).forEach(([k, v]) => {
      newShape[k === oldKey ? newKey : k] = v;
    });
    updateFormField(name, {
      type: "array",
      items: {
        type: "object",
        shape: newShape,
      },
    });
  };

  const updateFieldType = (key: string, type: string) => {
    updateFormField(name, {
      type: "array",
      items: {
        type: "object",
        shape: {
          ...shape,
          [key]: { type },
        },
      },
    });
  };

  return (
    <FieldBlockContentBox key={name}>
      <Label>
        <span className="whitespace-nowrap w-80 text-base">스키마 정의</span>
        <div className="flex flex-col gap-3 w-full">
          {/* 루트 타입 선택 */}
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600 w-24">데이터 타입</span>
            <Select value="array" onValueChange={updateRootType}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="object">객체 (단일)</SelectItem>
                <SelectItem value="array">배열 (여러 개)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 배열 아이템 타입 선택 */}
          <div className="flex gap-2 items-center border-t pt-2">
            <span className="text-sm text-gray-600 w-24">아이템 타입</span>
            <Select value={itemsType} onValueChange={updateItemsType}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">문자열</SelectItem>
                <SelectItem value="number">숫자</SelectItem>
                <SelectItem value="boolean">불린</SelectItem>
                <SelectItem value="object">객체</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 객체일 경우 필드 목록 */}
          {itemsType === "object" && (
            <div className="flex flex-col gap-2 w-full border-t pt-2">
              <div className="text-xs text-gray-500 mb-1">
                배열의 각 객체가 가질 필드를 정의하세요
              </div>
              {entries.map(([key, typeObj], index) => {
                const typeValue = (typeObj as any)?.type || "string";
                return (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={key}
                      onChange={(e) => updateFieldKey(key, e.target.value)}
                      placeholder="필드 이름"
                      className="flex-1"
                    />
                    <Select
                      value={typeValue}
                      onValueChange={(v) => updateFieldType(key, v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">문자열</SelectItem>
                        <SelectItem value="number">숫자</SelectItem>
                        <SelectItem value="boolean">불린</SelectItem>
                        <SelectItem value="array">배열</SelectItem>
                        <SelectItem value="object">객체</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeField(key)}
                      className="shrink-0"
                    >
                      삭제
                    </Button>
                  </div>
                );
              })}
              <Button variant="secondary" size="sm" onClick={addField}>
                + 필드 추가
              </Button>
            </div>
          )}
        </div>
      </Label>
    </FieldBlockContentBox>
  );
}
