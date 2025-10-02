import type { Edge } from "@xyflow/react";

/**
 * Switch 조건식 타입
 */
export interface WhenCondition {
  // 표현식 문자열
  expr?: string;
  // JSON 조건식
  equals?: { left: string; right: any };
  exists?: string;
  regex?: { value: string; pattern: string };
  contains?: { value: string; search: string };
  // 복합 조건
  and?: WhenCondition[];
  or?: WhenCondition[];
}

/**
 * Edge에 저장되는 조건 데이터
 */
export interface SwitchEdgeData extends Record<string, unknown> {
  // 조건부 분기를 위한 when 조건
  when?: WhenCondition;
  // 기본 분기인지 여부 (조건 없는 next)
  isDefault?: boolean;
  // Edge 라벨 (조건 표시용)
  conditionLabel?: string;
}

/**
 * 워크플로우에서 사용하는 Edge 타입
 */
export type WorkflowEdge = Edge<SwitchEdgeData>;
