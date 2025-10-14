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
import { Trash2 } from "lucide-react";

interface SchemaDefinitionFieldBlockProps {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
}

export const SchemaDefinitionFieldBlock = (
  props: SchemaDefinitionFieldBlockProps,
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
    return (
      <ArraySchemaFieldBlock
        field={field}
        formData={formData}
        updateFormField={updateFormField}
        updateRootType={updateRootType}
      />
    );
  }

  // rootType === "object"
  return (
    <ObjectSchemaFieldBlock
      field={field}
      formData={formData}
      updateFormField={updateFormField}
      updateRootType={updateRootType}
    />
  );
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
    const currentField = shape[key] as any;
    const fieldValue: any = { type };

    // string이나 number 타입이고 기존에 enum이 있었다면 유지
    if ((type === "string" || type === "number") && currentField?.enum) {
      fieldValue.enum = currentField.enum;
    }

    updateFormField(name, {
      type: "object",
      shape: {
        ...shape,
        [key]: fieldValue,
      },
    });
  };

  const updateFieldEnumValues = (key: string, valuesStr: string) => {
    const currentField = shape[key] as any;
    const fieldType = currentField?.type || "string";

    if (valuesStr.trim() === "") {
      // enum 제거
      const { enum: _, ...rest } = currentField;
      updateFormField(name, {
        type: "object",
        shape: {
          ...shape,
          [key]: rest,
        },
      });
    } else {
      // enum 추가/업데이트
      const values = valuesStr
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);
      updateFormField(name, {
        type: "object",
        shape: {
          ...shape,
          [key]: { ...currentField, type: fieldType, enum: values },
        },
      });
    }
  };

  return (
    <FieldBlockContentBox key={name} label="스키마 정의" location="top">
      <div className="flex flex-col gap-3 w-full">
        {/* 루트 타입 선택 */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600 w-24">데이터 타입</span>
          <Select value="object" onValueChange={updateRootType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="object">객체 (단일)</SelectItem>
              <SelectItem value="array">배열 (여러 개)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 필드 목록 */}
        <div className="flex flex-col gap-6 w-full border-t pt-2">
          {entries.map(([key, typeObj], index) => {
            const typeValue = (typeObj as any)?.type || "string";
            const enumValues = (typeObj as any)?.enum || [];
            const canHaveEnum =
              typeValue === "string" || typeValue === "number";

            return (
              <div key={index} className="flex gap-2 w-full">
                <div className="w-full flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
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
                  </div>
                  {canHaveEnum && (
                    <div className="pl-2 flex gap-2 items-center">
                      <span className="text-xs text-gray-500 w-20">
                        Enum 값:
                      </span>
                      <Input
                        value={enumValues.join(", ")}
                        onChange={(e) =>
                          updateFieldEnumValues(key, e.target.value)
                        }
                        placeholder="선택 사항: 쉼표로 구분 (예: MONTHLY, YEARLY)"
                        className="flex-1 text-sm"
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(key)}
                  className="shrink-0"
                >
                  <Trash2 className="size-5 text-red-500" />
                </Button>
              </div>
            );
          })}
        </div>
        <Button variant="secondary" size="sm" onClick={addField}>
          + 필드 추가
        </Button>
      </div>
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
      // string/number일 경우 기존 enum 유지
      const currentItems = items as any;
      const itemValue: any = { type: newType };
      if (
        (newType === "string" || newType === "number") &&
        currentItems?.enum
      ) {
        itemValue.enum = currentItems.enum;
      }
      updateFormField(name, {
        type: "array",
        items: itemValue,
      });
    }
  };

  const updateItemsEnumValues = (valuesStr: string) => {
    const currentItems = items as any;
    const itemType = currentItems?.type || "string";

    if (valuesStr.trim() === "") {
      // enum 제거
      const { enum: _, ...rest } = currentItems;
      updateFormField(name, {
        type: "array",
        items: rest,
      });
    } else {
      // enum 추가/업데이트
      const values = valuesStr
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);
      updateFormField(name, {
        type: "array",
        items: { ...currentItems, type: itemType, enum: values },
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
    const currentField = shape[key] as any;
    const fieldValue: any = { type };

    // string이나 number 타입이고 기존에 enum이 있었다면 유지
    if ((type === "string" || type === "number") && currentField?.enum) {
      fieldValue.enum = currentField.enum;
    }

    updateFormField(name, {
      type: "array",
      items: {
        type: "object",
        shape: {
          ...shape,
          [key]: fieldValue,
        },
      },
    });
  };

  const updateFieldEnumValues = (key: string, valuesStr: string) => {
    const currentField = shape[key] as any;
    const fieldType = currentField?.type || "string";

    if (valuesStr.trim() === "") {
      // enum 제거
      const { enum: _, ...rest } = currentField;
      updateFormField(name, {
        type: "array",
        items: {
          type: "object",
          shape: {
            ...shape,
            [key]: rest,
          },
        },
      });
    } else {
      // enum 추가/업데이트
      const values = valuesStr
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v);
      updateFormField(name, {
        type: "array",
        items: {
          type: "object",
          shape: {
            ...shape,
            [key]: { ...currentField, type: fieldType, enum: values },
          },
        },
      });
    }
  };

  return (
    <FieldBlockContentBox key={name} label="스키마 정의" location="top">
      <div className="flex flex-col gap-3 w-full">
        {/* 루트 타입 선택 */}
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600 w-24">데이터 타입</span>
          <Select value="array" onValueChange={updateRootType}>
            <SelectTrigger className="w-40">
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
            <SelectTrigger className="w-40">
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

        {/* string/number일 경우 enum 값 입력 */}
        {(itemsType === "string" || itemsType === "number") && (
          <div className="flex gap-2 items-center border-t pt-2">
            <span className="text-sm text-gray-600 w-24">Enum 값</span>
            <Input
              value={((items as any).enum || []).join(", ")}
              onChange={(e) => updateItemsEnumValues(e.target.value)}
              placeholder="선택 사항: 쉼표로 구분 (예: MONTHLY, YEARLY)"
              className="flex-1"
            />
          </div>
        )}

        {/* 객체일 경우 필드 목록 */}
        {itemsType === "object" && (
          <div className="flex flex-col gap-3 w-full border-t pt-2">
            <div className="text-xs text-gray-500 mb-1">
              배열의 각 객체가 가질 필드를 정의하세요
            </div>
            <section className="flex flex-col gap-6">
              {entries.map(([key, typeObj], index) => {
                const typeValue = (typeObj as any)?.type || "string";
                const enumValues = (typeObj as any)?.enum || [];
                const canHaveEnum =
                  typeValue === "string" || typeValue === "number";

                return (
                  <div key={index} className="flex gap-2 w-full">
                    <div className="w-full flex flex-col gap-2">
                      <div className="flex gap-2 items-center">
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
                      </div>
                      {canHaveEnum && (
                        <div className="pl-2 flex gap-2 items-center">
                          <span className="text-xs text-gray-500 w-20">
                            Enum 값:
                          </span>
                          <Input
                            value={enumValues.join(", ")}
                            onChange={(e) =>
                              updateFieldEnumValues(key, e.target.value)
                            }
                            placeholder="선택 사항: 쉼표로 구분 (예: MONTHLY, YEARLY)"
                            className="flex-1 text-sm"
                          />
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(key)}
                      className="shrink-0"
                    >
                      <Trash2 className="size-5 text-red-500" />
                    </Button>
                  </div>
                );
              })}
            </section>
            <Button variant="secondary" size="sm" onClick={addField}>
              + 필드 추가
            </Button>
          </div>
        )}
      </div>
    </FieldBlockContentBox>
  );
}
