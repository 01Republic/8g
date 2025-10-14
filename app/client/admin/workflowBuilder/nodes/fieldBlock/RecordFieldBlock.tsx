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
import { Checkbox } from "~/components/ui/checkbox";
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

type ValueType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export const RecordFieldBlock = (props: RecordFieldBlockProps) => {
  const { field, formData, updateFormField, currentNodeId } = props;
  const { name } = field;
  const { previousNodes, getNodeDisplayName, createNodeReference, repeatContextVariables, createRepeatReference } =
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
      if (Array.isArray(value)) {
        types[key] = 'array';
      } else if (typeof value === 'object' && value !== null) {
        types[key] = 'object';
      } else if (typeof value === 'boolean') {
        types[key] = 'boolean';
      } else if (typeof value === 'number') {
        types[key] = 'number';
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

  const handleUpdateEntry = (oldKey: string, newKey: string, value: any) => {
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
    
    // 새 키로 값 설정 (이미 타입에 맞는 값이 들어옴)
    if (newKey.trim() !== "") {
      newRecord[newKey] = value;
    }

    updateFormField(
      name,
      Object.keys(newRecord).length > 0 ? newRecord : undefined
    );
  };

  // 중첩된 객체 값 업데이트 핸들러
  const handleNestedObjectUpdate = (key: string, nestedValue: any) => {
    const newRecord = { ...recordValue };
    newRecord[key] = nestedValue;
    updateFormField(name, newRecord);
  };

  // Boolean 값 변경 핸들러
  const handleBooleanChange = (key: string, checked: boolean) => {
    const newRecord = { ...recordValue };
    newRecord[key] = checked;
    updateFormField(name, newRecord);
  };

  const handleTypeChange = (key: string, newType: ValueType) => {
    setKeyTypes((prev) => ({ ...prev, [key]: newType }));

    const newRecord = { ...recordValue };
    const currentValue = newRecord[key];

    if (newType === "number") {
      const numValue = Number(currentValue);
      newRecord[key] = isNaN(numValue) ? 0 : numValue;
    } else if (newType === 'boolean') {
      // boolean으로 변환
      if (typeof currentValue === 'boolean') {
        newRecord[key] = currentValue;
      } else if (typeof currentValue === 'string') {
        newRecord[key] = currentValue.toLowerCase() === 'true' || currentValue === '1';
      } else if (typeof currentValue === 'number') {
        newRecord[key] = currentValue !== 0;
      } else {
        newRecord[key] = false;
      }
    } else if (newType === 'array') {
      // 배열로 변환: 문자열이면 JSON 파싱 시도, 아니면 빈 배열
      if (typeof currentValue === 'string') {
        try {
          newRecord[key] = JSON.parse(currentValue);
        } catch {
          newRecord[key] = [];
        }
      } else if (Array.isArray(currentValue)) {
        newRecord[key] = currentValue;
      } else {
        newRecord[key] = [];
      }
    } else if (newType === 'object') {
      // 객체로 변환: 문자열이면 JSON 파싱 시도, 아니면 빈 객체
      if (typeof currentValue === 'string') {
        try {
          const parsed = JSON.parse(currentValue);
          newRecord[key] = typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch {
          newRecord[key] = {};
        }
      } else if (typeof currentValue === 'object' && !Array.isArray(currentValue) && currentValue !== null) {
        newRecord[key] = currentValue;
      } else {
        newRecord[key] = {};
      }
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
    } else if (valueType === 'array') {
      // 배열 타입: 스마트 파싱
      const trimmed = newValue.trim();
      
      // 배열 형태가 아니면 임시 문자열로 저장
      if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
        newRecord[key] = newValue;
      } else {
        try {
          // 표준 JSON 파싱 시도
          const parsed = JSON.parse(newValue);
          newRecord[key] = parsed;
        } catch {
          // JSON 파싱 실패 시 템플릿 리터럴 처리
          // [${...}] 형태를 ["${...}"] 형태로 변환 시도
          const fixed = newValue.replace(/\$\{([^}]+)\}/g, '"${$1}"');
          try {
            const parsed = JSON.parse(fixed);
            newRecord[key] = parsed;
          } catch {
            // 여전히 실패하면 문자열로 저장
            newRecord[key] = newValue;
          }
        }
      }
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
      (previousNodes.length > 0 || repeatContextVariables.length > 0)
    ) {
      setActiveDropdown(key);
    } else {
      setActiveDropdown(null);
    }
  };

  // 노드 선택 처리
  const handleNodeSelect = (key: string, nodeId: string) => {
    const nodeRef = createNodeReference(nodeId);
    const valueType = keyTypes[key] || 'string';
    const currentValue = valueType === 'array' && Array.isArray(recordValue[key])
      ? JSON.stringify(recordValue[key])
      : String(recordValue[key] || '');
    const cursorPos = cursorPositions[key] || 0;

    const beforeCursor = currentValue.slice(0, cursorPos - 2); // $. 제거
    const afterCursor = currentValue.slice(cursorPos);
    const newValue = beforeCursor + nodeRef + afterCursor;

    const newRecord = { ...recordValue };
    
    // 배열 타입이면 JSON 파싱
    if (valueType === 'array') {
      try {
        newRecord[key] = JSON.parse(newValue);
      } catch {
        newRecord[key] = newValue; // 파싱 실패하면 문자열로
      }
    } else {
      newRecord[key] = newValue;
    }
    
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

  // Repeat 컨텍스트 변수 선택 처리
  const handleRepeatContextSelect = (key: string, contextPath: string) => {
    const contextRef = createRepeatReference(contextPath);
    const valueType = keyTypes[key] || 'string';
    const currentValue = valueType === 'array' && Array.isArray(recordValue[key])
      ? JSON.stringify(recordValue[key])
      : String(recordValue[key] || '');
    const cursorPos = cursorPositions[key] || 0;
    
    const beforeCursor = currentValue.slice(0, cursorPos - 2); // $. 제거
    const afterCursor = currentValue.slice(cursorPos);
    const newValue = beforeCursor + contextRef + afterCursor;
    
    const newRecord = { ...recordValue };
    
    // 배열 타입이면 JSON 파싱
    if (valueType === 'array') {
      try {
        newRecord[key] = JSON.parse(newValue);
      } catch {
        newRecord[key] = newValue; // 파싱 실패하면 문자열로
      }
    } else {
      newRecord[key] = newValue;
    }
    
    updateFormField(name, newRecord);
    setActiveDropdown(null);
    
    // 커서 위치 복원
    setTimeout(() => {
      const inputElement = inputRefs.current[key];
      if (inputElement) {
        const newCursorPos = beforeCursor.length + contextRef.length;
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
              // 배열 타입일 때는 JSON으로 표시
              const valueStr = valueType === 'array' && Array.isArray(value)
                ? JSON.stringify(value)
                : valueType === 'object' && typeof value === 'object' && !Array.isArray(value)
                ? JSON.stringify(value)
                : String(value);

              return (
                <div key={index} className="flex flex-col gap-2">
                  <div
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
                        <SelectItem value="boolean">논리값</SelectItem>
                        <SelectItem value="array">배열</SelectItem>
                        <SelectItem value="object">객체</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="키"
                      value={key}
                      onChange={(e) =>
                        handleUpdateEntry(key, e.target.value, value)
                      }
                      className="flex-1"
                    />

                    {valueType === 'object' ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEntry(key)}
                        className="mt-0 !px-1"
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    ) : valueType === 'boolean' ? (
                      <>
                        <div className="flex-1 flex items-center gap-2">
                          <Checkbox
                            checked={!!value}
                            onCheckedChange={(checked) => handleBooleanChange(key, checked === true)}
                          />
                          <span className="text-sm text-gray-600">
                            {value ? 'true' : 'false'}
                          </span>
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
                      </>
                    ) : (
                      <>
                        <div className="flex-1 relative">
                          <Input
                            ref={(el) => {
                              inputRefs.current[key] = el;
                            }}
                            placeholder={valueType === 'array' ? '배열 (예: ["${$.forEach.item}"])' : '값 ($.로 노드 참조)'}
                            type={valueType === "number" ? "number" : "text"}
                            value={valueStr}
                            onChange={(e) => {
                              const cursorPos = e.target.selectionStart || 0;
                              handleValueChange(key, e.target.value, cursorPos);
                            }}
                          />
                          {valueType === 'array' && (
                            <p className="text-xs text-gray-500 mt-1">
                              배열 형태로 입력하세요 (예: [${'{'}$.forEach.item{'}'}] 또는 ["${'{'}$.forEach.item{'}'}"])
                            </p>
                          )}
                          {activeDropdown === key && (previousNodes.length > 0 || repeatContextVariables.length > 0) && (
                            <div
                              ref={dropdownRef}
                              className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                            >
                              {repeatContextVariables.length > 0 && (
                                <>
                                  <div className="p-2 text-xs text-gray-500 border-b">반복 컨텍스트 변수</div>
                                  {repeatContextVariables.map((ctx) => (
                                    <div
                                      key={ctx.id}
                                      onClick={() => handleRepeatContextSelect(key, ctx.id)}
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                      {ctx.label}
                                    </div>
                                  ))}
                                </>
                              )}
                              {previousNodes.length > 0 && (
                                <>
                                  <div className="p-2 text-xs text-gray-500 border-b">이전 노드 선택</div>
                                  {previousNodes.map((node) => (
                                    <div
                                      key={node.id}
                                      onClick={() => handleNodeSelect(key, node.id)}
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                      {getNodeDisplayName(node)}
                                    </div>
                                  ))}
                                </>
                              )}
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
                      </>
                    )}
                  </div>
                  
                  {/* 객체 타입일 때 중첩 레코드 편집기 렌더링 */}
                  {valueType === 'object' && (
                    <div className="ml-7 p-2 bg-gray-50 rounded border border-gray-200">
                      <RecordFieldBlock
                        field={{ 
                          name: key, 
                          type: 'record',
                          optional: false,
                          description: `중첩 객체: ${key}`
                        }}
                        formData={{ [key]: typeof value === 'object' && !Array.isArray(value) ? value : {} }}
                        updateFormField={(_, nestedValue) => handleNestedObjectUpdate(key, nestedValue)}
                        currentNodeId={currentNodeId}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FieldBlockContentBox>
  );
};
