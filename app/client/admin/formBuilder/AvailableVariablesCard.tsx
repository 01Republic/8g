import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useState } from "react";

interface AvailableVariable {
  name: string;
  source: string;
  description: string;
}

interface AvailableVariablesCardProps {
  sectionIndex: number;
  sections: any[];
}

export function AvailableVariablesCard({
  sectionIndex,
  sections,
}: AvailableVariablesCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

  // 현재 섹션 이전의 모든 섹션에서 생성될 variables 추출
  const availableVariables: AvailableVariable[] = [];

  for (let i = 0; i < sectionIndex; i++) {
    const section = sections[i];
    const type = section.uiSchema?.type;

    if (type === "workspace-select") {
      const sectionName = section.uiSchema?.title || `Section ${i + 1}`;
      availableVariables.push(
        {
          name: "workspaceSelectId",
          source: sectionName,
          description: "선택한 워크스페이스 ID",
        },
        {
          name: "workspaceSelectName",
          source: sectionName,
          description: "선택한 워크스페이스 이름",
        },
      );
    } else if (type === "member-table") {
      const sectionName = section.uiSchema?.title || `Section ${i + 1}`;
      availableVariables.push({
        name: "memberTable",
        source: sectionName,
        description: "멤버 목록 배열",
      });
    } else if (type === "permission-check") {
      const sectionName = section.uiSchema?.title || `Section ${i + 1}`;
      availableVariables.push({
        name: "permissionCheck",
        source: sectionName,
        description: "권한 확인 결과",
      });
    }
  }

  const copyVariable = (varName: string) => {
    navigator.clipboard.writeText(`\${vars.${varName}}`);
    setCopied(varName);
    setTimeout(() => setCopied(null), 2000);
  };

  if (availableVariables.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            📦 Available Variables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500 text-center py-2">
            이전 섹션이 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          📦 Available Variables
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {availableVariables.map((variable, idx) => (
          <div
            key={idx}
            className="p-2 bg-white rounded border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <code className="text-xs font-mono text-blue-600">
                ${"{vars."}
                {variable.name}
                {"}"}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => copyVariable(variable.name)}
              >
                {copied === variable.name ? "✓" : "📋"}
              </Button>
            </div>
            <div className="text-xs text-gray-600">{variable.description}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              from: {variable.source}
            </div>
          </div>
        ))}

        <div className="mt-3 p-2 bg-blue-100 rounded text-xs space-y-1">
          <div className="font-medium text-blue-900">💡 사용법:</div>
          <div className="text-blue-700">
            Workflow의 selector, targetUrl 등에서 사용하세요
          </div>
          <div className="text-blue-700">
            예: selector: "#workspace-${"${vars.workspaceSelectId}"}"
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
