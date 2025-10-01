import { Label } from "~/components/ui/label";
import type { ParsedField } from "~/lib/schema-parser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FieldBlockContentBox } from "./FieldBlockContentBox";

interface EnumFieldBlockProps {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
}

export const EnumFieldBlock = (props: EnumFieldBlockProps) => {
  const { field, formData, updateFormField } = props;
  const { name, enumValues } = field;

  return (
    <FieldBlockContentBox key={name}>
      <Label>
        <span className="whitespace-nowrap w-80 text-base">{name}</span>
        <Select
          value={formData[name] ?? ""}
          onValueChange={(v) => updateFormField(name, v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`${name} 선택`} />
          </SelectTrigger>
          <SelectContent>
            {enumValues?.map((val) => (
              <SelectItem key={val} value={val}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>
    </FieldBlockContentBox>
  );
};
