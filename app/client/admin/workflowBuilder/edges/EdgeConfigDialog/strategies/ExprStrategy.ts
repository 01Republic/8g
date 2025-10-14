import type { WhenCondition } from "~/models/workflow/types";
import type { EdgeFormState } from "../edgeDataConverter";
import { BaseConditionStrategy } from "./types";

/**
 * Expr 조건 전략
 */
export class ExprStrategy extends BaseConditionStrategy {
  parseFromWhen(
    when: WhenCondition,
    formState: Partial<EdgeFormState>,
  ): void {
    if (!when.expr) return;

    formState.exprValue = when.expr;
  }

  buildWhen(formState: EdgeFormState): WhenCondition {
    return {
      expr: formState.exprValue,
    };
  }

  getLabel(formState: EdgeFormState): string {
    return formState.exprValue.length > 15
      ? formState.exprValue.substring(0, 15) + "..."
      : formState.exprValue;
  }
}

