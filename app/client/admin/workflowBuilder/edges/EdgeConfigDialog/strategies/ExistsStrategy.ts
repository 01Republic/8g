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
 * Exists 조건 전략
 */
export class ExistsStrategy extends BaseConditionStrategy {
  parseFromWhen(
    when: WhenCondition,
    formState: Partial<EdgeFormState>,
  ): void {
    if (!when.exists) return;

    formState.selectedNodeId = extractNodeIdFromPath(when.exists);
    formState.existsResultPath =
      extractPathFromJsonPath(when.exists) || "result";
  }

  buildWhen(formState: EdgeFormState): WhenCondition {
    const existsPath = buildJsonPath(
      formState.selectedNodeId,
      formState.existsResultPath,
    );
    return {
      exists: existsPath,
    };
  }

  getLabel(formState: EdgeFormState): string {
    return "exists";
  }

  buildFromSubCondition(sub: SubCondition): WhenCondition {
    const fullPath = buildJsonPath(sub.nodeId, sub.path);
    return {
      exists: fullPath,
    };
  }

  parseToSubCondition(when: WhenCondition, id: string): SubCondition | null {
    if (!when.exists) return null;

    const match = when.exists?.match(/\$\.steps\.([^.]+)\.(.+)/);
    return {
      id,
      type: "exists",
      nodeId: match?.[1] || "",
      path: match?.[2] || "result",
    };
  }
}

