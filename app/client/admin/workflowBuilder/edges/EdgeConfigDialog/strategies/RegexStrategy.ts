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
 * Regex 조건 전략
 */
export class RegexStrategy extends BaseConditionStrategy {
  parseFromWhen(
    when: WhenCondition,
    formState: Partial<EdgeFormState>,
  ): void {
    if (!when.regex) return;

    formState.selectedNodeId = extractNodeIdFromPath(when.regex.value || "");
    formState.regexResultPath =
      extractPathFromJsonPath(when.regex.value || "") || "result.data";
    formState.regexPattern = when.regex.pattern || "";
  }

  buildWhen(formState: EdgeFormState): WhenCondition {
    const regexPath = buildJsonPath(
      formState.selectedNodeId,
      formState.regexResultPath,
    );
    return {
      regex: { value: regexPath, pattern: formState.regexPattern },
    };
  }

  getLabel(formState: EdgeFormState): string {
    return `~= ${formState.regexPattern}`;
  }

  buildFromSubCondition(sub: SubCondition): WhenCondition {
    const fullPath = buildJsonPath(sub.nodeId, sub.path);
    return {
      regex: { value: fullPath, pattern: sub.value || "" },
    };
  }

  parseToSubCondition(when: WhenCondition, id: string): SubCondition | null {
    if (!when.regex) return null;

    const match = when.regex.value?.match(/\$\.steps\.([^.]+)\.(.+)/);
    return {
      id,
      type: "regex",
      nodeId: match?.[1] || "",
      path: match?.[2] || "result.data",
      value: when.regex.pattern || "",
    };
  }
}

