import { z } from "zod";

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "array"
  | "object"
  | "record"
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

/**
 * Zod schema에서 필드 정보 추출
 */
function parseField(name: string, schema: any): ParsedField | null {
  // 1. Wrapper 벗기기
  const { unwrapped, optional, defaultValue } = unwrapZodSchema(schema);

  // 2. 타입 결정
  const typeInfo = determineFieldType(unwrapped);

  // 3. 필드 객체 조합
  const field: ParsedField = {
    name,
    optional,
    defaultValue: defaultValue ?? typeInfo.defaultValue,
    ...typeInfo,
  };

  // 4. Description 추가
  if ((unwrapped as any)._def?.description) {
    field.description = (unwrapped as any)._def.description;
  }

  return field;
}

/**
 * Zod schema에서 optional/default/nullable wrapper를 벗겨내기
 */
function unwrapZodSchema(schema: any): {
  unwrapped: any;
  optional: boolean;
  defaultValue?: any;
} {
  let currentSchema = schema;
  let state = { optional: false, defaultValue: undefined };

  while (true) {
    const handler = unwrapHandlers.find((h) => h.check(currentSchema));

    if (!handler) break;

    const result = handler.unwrap(currentSchema, state);
    currentSchema = result.schema;
    state = {
      optional: result.optional,
      defaultValue: result.defaultValue,
    };
  }

  return {
    unwrapped: currentSchema,
    optional: state.optional,
    defaultValue: state.defaultValue,
  };
}

/**
 * Wrapper 타입별 언래핑 핸들러
 */
type UnwrapHandler = {
  check: (schema: any) => boolean;
  unwrap: (
    schema: any,
    state: { optional: boolean; defaultValue?: any },
  ) => {
    schema: any;
    optional: boolean;
    defaultValue?: any;
  };
};

const unwrapHandlers: UnwrapHandler[] = [
  {
    check: (s) => s instanceof z.ZodOptional,
    unwrap: (s, state) => ({
      schema: s._def.innerType,
      optional: true,
      defaultValue: state.defaultValue,
    }),
  },
  {
    check: (s) => s instanceof z.ZodDefault,
    unwrap: (s, state) => ({
      schema: s._def.innerType,
      optional: state.optional,
      defaultValue:
        typeof s._def.defaultValue === "function"
          ? s._def.defaultValue()
          : s._def.defaultValue,
    }),
  },
  {
    check: (s) => s instanceof z.ZodNullable,
    unwrap: (s, state) => ({
      schema: s._def.innerType,
      optional: true,
      defaultValue: state.defaultValue,
    }),
  },
];

/**
 * Zod schema의 타입을 결정하고 추가 정보 추출
 */
function determineFieldType(
  schema: any,
): Pick<
  ParsedField,
  "type" | "enumValues" | "arrayItemType" | "unionTypes" | "defaultValue"
> {
  const handler = typeHandlers.find((h) => h.check(schema));
  return handler ? handler.handle(schema) : { type: "string" }; // default
}

/**
 * 타입별 핸들러 정의
 */
type TypeHandler = {
  check: (schema: any) => boolean;
  handle: (
    schema: any,
  ) => Pick<
    ParsedField,
    "type" | "enumValues" | "arrayItemType" | "unionTypes" | "defaultValue"
  >;
};

const typeHandlers: TypeHandler[] = [
  {
    check: (s) => s instanceof z.ZodString,
    handle: () => ({ type: "string" }),
  },
  {
    check: (s) => s instanceof z.ZodNumber,
    handle: () => ({ type: "number" }),
  },
  {
    check: (s) => s instanceof z.ZodBoolean,
    handle: () => ({ type: "boolean" }),
  },
  {
    check: (s) => s instanceof z.ZodEnum,
    handle: (s) => ({
      type: "enum",
      enumValues: s.options || Object.values(s._def.entries || {}),
    }),
  },
  {
    check: (s) => s instanceof z.ZodLiteral,
    handle: (s) => ({
      type: "literal",
      defaultValue: s._def.value,
    }),
  },
  {
    check: (s) => s instanceof z.ZodArray,
    handle: (s) => {
      const itemType = s._def.element || s.element;
      return {
        type: "array",
        arrayItemType:
          itemType instanceof z.ZodString
            ? "string"
            : itemType instanceof z.ZodNumber
              ? "number"
              : undefined,
      };
    },
  },
  {
    check: (s) => s instanceof z.ZodRecord,
    handle: () => ({ type: "record" }),
  },
  {
    check: (s) => s instanceof z.ZodObject,
    handle: () => ({ type: "object" }),
  },
  {
    check: (s) => s._def?.typeName === "ZodUnion",
    handle: (s) => ({
      type: "union",
      unionTypes: s._def.options.map((opt: any) => {
        if (opt instanceof z.ZodString) return "string";
        if (opt instanceof z.ZodArray) return "array";
        return "string";
      }),
    }),
  },
];
