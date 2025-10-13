import { Label } from "~/components/ui/label";
import { FieldBlockContentBox } from "./FieldBlockContentBox";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { ParsedField } from "~/lib/schema-parser";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

interface RecordFieldBlockProps {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
}

export const RecordFieldBlock = (props: RecordFieldBlockProps) => {
  const { field, formData, updateFormField } = props;
  const { name } = field;

  // formData[name]을 key-value 쌍 배열로 변환
  const recordValue = formData[name] || {};
  const entries = Object.entries(recordValue);

  const handleAddEntry = () => {
    const newRecord = { ...recordValue, "": "" };
    updateFormField(name, newRecord);
  };

  const handleRemoveEntry = (keyToRemove: string) => {
    const newRecord = { ...recordValue };
    delete newRecord[keyToRemove];
    updateFormField(name, Object.keys(newRecord).length > 0 ? newRecord : undefined);
  };

  const handleUpdateEntry = (oldKey: string, newKey: string, newValue: string) => {
    const newRecord = { ...recordValue };
    
    // 기존 키 삭제
    if (oldKey !== newKey) {
      delete newRecord[oldKey];
    }
    
    // 새 키로 값 설정
    if (newKey.trim() !== "") {
      newRecord[newKey] = newValue;
    }
    
    updateFormField(name, Object.keys(newRecord).length > 0 ? newRecord : undefined);
  };

  return (
    <FieldBlockContentBox key={name}>
      <div className="flex items-center justify-between">
        <Label className="text-base">{name}</Label>
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={handleAddEntry}
        >
          <Plus className="w-4 h-4 mr-1" />
          추가
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {entries.length === 0 && (
          <p className="text-xs text-gray-500">
            키-값 쌍이 없습니다. 추가 버튼을 클릭하세요.
          </p>
        )}
        {entries.map(([key, value], index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              placeholder="키"
              value={key}
              onChange={(e) => handleUpdateEntry(key, e.target.value, value as string)}
              className="flex-1"
            />
            <Input
              placeholder="값"
              value={value as string}
              onChange={(e) => handleUpdateEntry(key, key, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => handleRemoveEntry(key)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </FieldBlockContentBox>
  );
};

