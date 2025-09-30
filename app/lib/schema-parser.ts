import { z } from "zod";

export type FieldType = 
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "array"
  | "object"
  | "literal"
  | "union";

export interface ParsedField {
  name: string;
  type: FieldType;
  optional: boolean;
  defaultValue?: any;
  description?: string;
  // For enum/literal types
  enumValues?: string[];
  // For array types
  arrayItemType?: FieldType;
  // For union types
  unionTypes?: FieldType[];
}

export interface ParsedSchema {
  fields: ParsedField[];
  blockName?: string;
}

/**
 * Zod schema를 파싱해서 필드 정보 추출
 */
export function parseZodSchema(schema: any): ParsedSchema {
  const fields: ParsedField[] = [];
  
  if (!(schema instanceof z.ZodObject)) {
    return { fields };
  }

  const shape = schema.shape;
  
  for (const [fieldName, fieldSchema] of Object.entries(shape)) {
    const parsed = parseField(fieldName, fieldSchema as any);
    if (parsed) {
      fields.push(parsed);
    }
  }

  return { fields };
}

function parseField(name: string, schema: any): ParsedField | null {
  let currentSchema = schema;
  let optional = false;
  let defaultValue: any = undefined;

  // Unwrap optional/default/nullable
  while (true) {
    if (currentSchema instanceof z.ZodOptional) {
      optional = true;
      currentSchema = (currentSchema as any)._def.innerType;
    } else if (currentSchema instanceof z.ZodDefault) {
      defaultValue = typeof (currentSchema as any)._def.defaultValue === 'function' 
        ? (currentSchema as any)._def.defaultValue() 
        : (currentSchema as any)._def.defaultValue;
      currentSchema = (currentSchema as any)._def.innerType;
    } else if (currentSchema instanceof z.ZodNullable) {
      optional = true;
      currentSchema = (currentSchema as any)._def.innerType;
    } else {
      break;
    }
  }

  const field: ParsedField = {
    name,
    optional,
    type: "string", // default
    defaultValue,
  };

  // Determine type
  if (currentSchema instanceof z.ZodString) {
    field.type = "string";
  } else if (currentSchema instanceof z.ZodNumber) {
    field.type = "number";
  } else if (currentSchema instanceof z.ZodBoolean) {
    field.type = "boolean";
  } else if (currentSchema instanceof z.ZodEnum) {
    field.type = "enum";
    // ZodEnum은 options 배열에 enum 값들이 있음
    field.enumValues = (currentSchema as any).options || Object.values((currentSchema as any)._def.entries || {});
  } else if (currentSchema instanceof z.ZodLiteral) {
    field.type = "literal";
    field.defaultValue = (currentSchema as any)._def.value;
  } else if (currentSchema instanceof z.ZodArray) {
    field.type = "array";
    // ZodArray의 element 타입은 _def.element 또는 .element에 있음
    const itemType = (currentSchema as any)._def.element || (currentSchema as any).element;
    if (itemType instanceof z.ZodString) {
      field.arrayItemType = "string";
    } else if (itemType instanceof z.ZodNumber) {
      field.arrayItemType = "number";
    }
  } else if (currentSchema instanceof z.ZodObject) {
    field.type = "object";
  } else if ((currentSchema as any)._def?.typeName === 'ZodUnion') {
    field.type = "union";
    const options = (currentSchema as any)._def.options;
    field.unionTypes = options.map((opt: any) => {
      if (opt instanceof z.ZodString) return "string";
      if (opt instanceof z.ZodArray) return "array";
      return "string";
    });
  }

  // Description from metadata
  if ((currentSchema as any)._def?.description) {
    field.description = (currentSchema as any)._def.description;
  }

  return field;
}
