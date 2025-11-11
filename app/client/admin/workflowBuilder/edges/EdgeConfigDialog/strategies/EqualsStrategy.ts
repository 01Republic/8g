import type { WhenCondition } from "~/models/workflow/types";
import type { EdgeFormState } from "../edgeDataConverter";
import type { SubCondition } from "../types";
import { BaseConditionStrategy } from "./types";
import {
  extractNodeIdFromPath,
  extractPathFromJsonPath,
  buildJsonPath,
} from "../../../utils/conditionUtils";

/**
 * Equals 조건 전략
 */
export class EqualsStrategy extends BaseConditionStrategy {
  parseFromWhen(when: WhenCondition, formState: Partial<EdgeFormState>): void {
    if (!when.equals) return;

    formState.equalsData = {
      nodeId: extractNodeIdFromPath(when.equals.left || ""),
      path: extractPathFromJsonPath(when.equals.left || "") || "result.data",
      value: when.equals.right || "",
    };
  }

  buildWhen(formState: EdgeFormState): WhenCondition {
    const { nodeId, path, value } = formState.equalsData;
    const leftPath = buildJsonPath(nodeId, path);
    return {
      equals: { left: leftPath, right: value },
    };
  }

  getLabel(formState: EdgeFormState): string {
    return `== ${formState.equalsData.value}`;
  }

  buildFromSubCondition(sub: SubCondition): WhenCondition {
    const fullPath = buildJsonPath(sub.nodeId, sub.path);
    return {
      equals: { left: fullPath, right: sub.value },
    };
  }

  parseToSubCondition(when: WhenCondition, id: string): SubCondition | null {
    if (!when.equals) return null;

    const match = when.equals.left?.match(/\$\.steps\.([^.]+)\.(.+)/);
    return {
      id,
      type: "equals",
      nodeId: match?.[1] || "",
      path: match?.[2] || "result.data",
      value: when.equals.right || "",
    };
  }
}
