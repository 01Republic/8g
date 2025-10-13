import type { ParsedField } from "~/lib/schema-parser";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { FieldBlockContentBox } from "./FieldBlockContentBox";

interface CodeFieldBlockProps {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
}

export const CodeFieldBlock = (props: CodeFieldBlockProps) => {
  const { field, formData, updateFormField } = props;
  const { name, defaultValue } = field;

  return (
    <FieldBlockContentBox key={name}>
      <Label htmlFor={name}>
        <span className="whitespace-nowrap w-80 text-base">
          JavaScript 코드
        </span>
        <Textarea
          id={name}
          value={formData[name] ?? ""}
          onChange={(e) => updateFormField(name, e.target.value)}
          placeholder={defaultValue || "// JavaScript 코드를 입력하세요\n// inputData를 사용할 수 있습니다\nreturn { result: inputData };"}
          className="font-mono text-sm min-h-[200px]"
          spellCheck={false}
        />
      </Label>
    </FieldBlockContentBox>
  );
};

