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
 * Contains 조건 전략
 */
export class ContainsStrategy extends BaseConditionStrategy {
  parseFromWhen(
    when: WhenCondition,
    formState: Partial<EdgeFormState>,
  ): void {
    if (!when.contains) return;

    formState.selectedNodeId = extractNodeIdFromPath(when.contains.value || "");
    formState.containsResultPath =
      extractPathFromJsonPath(when.contains.value || "") || "result.data";
    formState.containsSearch = when.contains.search || "";
  }

  buildWhen(formState: EdgeFormState): WhenCondition {
    const containsPath = buildJsonPath(
      formState.selectedNodeId,
      formState.containsResultPath,
    );
    return {
      contains: { value: containsPath, search: formState.containsSearch },
    };
  }

  getLabel(formState: EdgeFormState): string {
    return `contains ${formState.containsSearch}`;
  }

  buildFromSubCondition(sub: SubCondition): WhenCondition {
    const fullPath = buildJsonPath(sub.nodeId, sub.path);
    return {
      contains: { value: fullPath, search: sub.value || "" },
    };
  }

  parseToSubCondition(when: WhenCondition, id: string): SubCondition | null {
    if (!when.contains) return null;

    const match = when.contains.value?.match(/\$\.steps\.([^.]+)\.(.+)/);
    return {
      id,
      type: "contains",
      nodeId: match?.[1] || "",
      path: match?.[2] || "result.data",
      value: when.contains.search || "",
    };
  }
}

