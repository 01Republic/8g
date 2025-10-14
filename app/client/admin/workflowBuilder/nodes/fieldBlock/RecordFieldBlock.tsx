import { Label } from "~/components/ui/label";
import { FieldBlockContentBox } from "./FieldBlockContentBox";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { ParsedField } from "~/lib/schema-parser";
import { useState, useRef, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { usePreviousNodes } from "./usePreviousNodes";

interface RecordFieldBlockProps {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
  currentNodeId?: string;
}

type ValueType = "string" | "number";

export const RecordFieldBlock = (props: RecordFieldBlockProps) => {
  const { field, formData, updateFormField, currentNodeId } = props;
  const { name } = field;
  const { previousNodes, getNodeDisplayName, createNodeReference } =
    usePreviousNodes(currentNodeId || "");

  // 각 키별 자동완성 상태
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cursorPositions, setCursorPositions] = useState<{
    [key: string]: number;
  }>({});

  // formData[name]을 key-value 쌍 배열로 변환
  const recordValue = formData[name] || {};
  const entries = Object.entries(recordValue);

  // 각 키의 타입 정보를 관리 (키: 타입)
  const [keyTypes, setKeyTypes] = useState<Record<string, ValueType>>(() => {
    const types: Record<string, ValueType> = {};
    Object.entries(recordValue).forEach(([key, value]) => {
      if (typeof value === "number") {
        types[key] = "number";
      } else {
        types[key] = "string";
      }
    });
    return types;
  });

  const handleAddEntry = () => {
    const newRecord = { ...recordValue, "": "" };
    setKeyTypes((prev) => ({ ...prev, "": "string" }));
    updateFormField(name, newRecord);
  };

  const handleRemoveEntry = (keyToRemove: string) => {
    const newRecord = { ...recordValue };
    delete newRecord[keyToRemove];
    setKeyTypes((prev) => {
      const newTypes = { ...prev };
      delete newTypes[keyToRemove];
      return newTypes;
    });
    updateFormField(
      name,
      Object.keys(newRecord).length > 0 ? newRecord : undefined
    );
  };

  const handleUpdateEntry = (
    oldKey: string,
    newKey: string,
    newValue: string
  ) => {
    const newRecord = { ...recordValue };
    const valueType = keyTypes[oldKey] || "string";

    // 기존 키 삭제
    if (oldKey !== newKey) {
      delete newRecord[oldKey];
      setKeyTypes((prev) => {
        const newTypes = { ...prev };
        delete newTypes[oldKey];
        if (newKey.trim() !== "") {
          newTypes[newKey] = valueType;
        }
        return newTypes;
      });
    }

    // 새 키로 값 설정 (타입에 맞게 변환)
    if (newKey.trim() !== "") {
      if (valueType === "number") {
        const numValue = Number(newValue);
        newRecord[newKey] = isNaN(numValue) ? 0 : numValue;
      } else {
        newRecord[newKey] = newValue;
      }
    }

    updateFormField(
      name,
      Object.keys(newRecord).length > 0 ? newRecord : undefined
    );
  };

  const handleTypeChange = (key: string, newType: ValueType) => {
    setKeyTypes((prev) => ({ ...prev, [key]: newType }));

    const newRecord = { ...recordValue };
    const currentValue = newRecord[key];

    if (newType === "number") {
      const numValue = Number(currentValue);
      newRecord[key] = isNaN(numValue) ? 0 : numValue;
    } else {
      newRecord[key] = String(currentValue);
    }

    updateFormField(name, newRecord);
  };

  // Value Input 변경 처리 (자동완성 포함)
  const handleValueChange = (
    key: string,
    newValue: string,
    cursorPos: number
  ) => {
    const newRecord = { ...recordValue };
    const valueType = keyTypes[key] || "string";

    // 타입에 맞게 값 설정
    if (valueType === "number") {
      const numValue = Number(newValue);
      newRecord[key] = isNaN(numValue) ? newValue : numValue; // 입력 중에는 문자열도 허용
    } else {
      newRecord[key] = newValue;
    }

    updateFormField(
      name,
      Object.keys(newRecord).length > 0 ? newRecord : undefined
    );
    setCursorPositions((prev) => ({ ...prev, [key]: cursorPos }));

    // $. 감지
    if (
      newValue.slice(0, cursorPos).endsWith("$.") &&
      previousNodes.length > 0
    ) {
      setActiveDropdown(key);
    } else {
      setActiveDropdown(null);
    }
  };

  // 노드 선택 처리
  const handleNodeSelect = (key: string, nodeId: string) => {
    const nodeRef = createNodeReference(nodeId);
    const currentValue = String(recordValue[key] || "");
    const cursorPos = cursorPositions[key] || 0;

    const beforeCursor = currentValue.slice(0, cursorPos - 2); // $. 제거
    const afterCursor = currentValue.slice(cursorPos);
    const newValue = beforeCursor + nodeRef + afterCursor;

    const newRecord = { ...recordValue };
    newRecord[key] = newValue;
    updateFormField(name, newRecord);
    setActiveDropdown(null);

    // 커서 위치 복원
    setTimeout(() => {
      const inputElement = inputRefs.current[key];
      if (inputElement) {
        const newCursorPos = beforeCursor.length + nodeRef.length;
        inputElement.setSelectionRange(newCursorPos, newCursorPos);
        inputElement.focus();
      }
    }, 0);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        const clickedInput = Object.values(inputRefs.current).some(
          (input) => input && input.contains(event.target as Node)
        );
        if (!clickedInput) {
          setActiveDropdown(null);
        }
      }
    };

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [activeDropdown]);

  return (
    <FieldBlockContentBox key={name} label={name} location="top">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-end w-full">
          <div className="flex gap-1 items-center ">
            {entries.length === 0 && (
              <p className="text-xs text-red-500">
                키-값 쌍이 없습니다. 추가 버튼을 클릭하세요.
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddEntry}
            >
              <Plus className="w-4 h-4 mr-1" />
              추가
            </Button>
          </div>
        </div>
        {entries.length > 0 && (
          <div className="flex flex-col gap-2 border px-3 py-4 rounded-lg ">
            {entries.map(([key, value], index) => {
              const valueType = keyTypes[key] || "string";
              const valueStr = String(value);

              return (
                <div
                  key={index}
                  className="flex gap-2 items-center justify-start"
                >
                  <span className="w-5">{index + 1}.</span>
                  <Select
                    value={valueType}
                    onValueChange={(newType: ValueType) =>
                      handleTypeChange(key, newType)
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">문자열</SelectItem>
                      <SelectItem value="number">숫자</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="키"
                    value={key}
                    onChange={(e) =>
                      handleUpdateEntry(key, e.target.value, valueStr)
                    }
                    className="flex-1"
                  />

                  <div className="flex-1 relative">
                    <Input
                      ref={(el) => {
                        inputRefs.current[key] = el;
                      }}
                      placeholder="값 ($.로 노드 참조)"
                      type={valueType === "number" ? "number" : "text"}
                      value={valueStr}
                      onChange={(e) => {
                        const cursorPos = e.target.selectionStart || 0;
                        handleValueChange(key, e.target.value, cursorPos);
                      }}
                    />
                    {activeDropdown === key && previousNodes.length > 0 && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                      >
                        <div className="p-2 text-xs text-gray-500 border-b">
                          이전 노드 선택
                        </div>
                        {previousNodes.map((node) => (
                          <div
                            key={node.id}
                            onClick={() => handleNodeSelect(key, node.id)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {getNodeDisplayName(node)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveEntry(key)}
                    className="mt-0 !px-1"
                  >
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FieldBlockContentBox>
  );
};
