import { getAllSectionResults } from "./SectionResultManager";

/**
 * 이전 섹션들의 결과를 자동으로 variables로 변환
 */
export function generateVariablesFromSectionResults(): Record<string, any> {
  const sectionResults = getAllSectionResults();
  const variables: Record<string, any> = {};

  Object.entries(sectionResults).forEach(([sectionId, sectionResult]) => {
    const result = sectionResult.result;

    // 결과가 객체인 경우 flatten
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      // selectedWorkspace: { elementId: "kerrys", elementText: "..." }
      // → workspaceId: "kerrys", workspaceName: "..."
      
      if ('elementId' in result && 'elementText' in result) {
        // Workspace 패턴
        const prefix = sectionId.replace(/Section$/, '').replace(/-/g, '');
        variables[`${prefix}Id`] = result.elementId;
        variables[`${prefix}Name`] = result.elementText;
      } else {
        // 기타 객체는 그대로 전달
        Object.entries(result).forEach(([key, value]) => {
          variables[key] = value;
        });
      }
    } else {
      // 배열이나 단순 값은 섹션 ID를 키로 사용
      variables[sectionId] = result;
    }
  });

  console.log('🔧 Auto-generated variables:', variables);
  return variables;
}
