import { Label } from "~/components/ui/label";
import { FieldBlockContentBox } from "./FieldBlockContentBox";
import { Input } from "~/components/ui/input";
import type { ParsedField } from "~/lib/schema-parser";

interface NumberFieldBlockProps {
  field: ParsedField;
  formData: Record<string, any>;
  updateFormField: (fieldName: string, value: any) => void;
}

export const NumberFieldBlock = (props: NumberFieldBlockProps) => {
  const { field, formData, updateFormField } = props;
  const { name, defaultValue } = field;

  return (
    <FieldBlockContentBox key={name}>
      <Label htmlFor={name}>
        <span className="whitespace-nowrap w-80 text-base">{name}</span>
        <Input
          id={name}
          type="number"
          value={formData[name] ?? ""}
          onChange={(e) =>
            updateFormField(name, e.target.value ? Number(e.target.value) : "")
          }
          placeholder={defaultValue}
        />
      </Label>
    </FieldBlockContentBox>
  );
};
