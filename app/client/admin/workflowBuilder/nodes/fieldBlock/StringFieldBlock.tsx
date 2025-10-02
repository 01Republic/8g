import type { ParsedField } from "~/lib/schema-parser";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { FieldBlockContentBox } from "./FieldBlockContentBox";

interface StringFieldBlockProps {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
}

export const StringFieldBlock = (props: StringFieldBlockProps) => {
  const { field, formData, updateFormField } = props;
  const { name, defaultValue } = field;

  return (
    <FieldBlockContentBox key={name}>
      <Label htmlFor={name}>
        <span className="whitespace-nowrap w-80 text-base">{name}</span>
        <Input
          id={name}
          value={formData[name] ?? ""}
          onChange={(e) => updateFormField(name, e.target.value)}
          placeholder={defaultValue}
        />
      </Label>
    </FieldBlockContentBox>
  );
};
