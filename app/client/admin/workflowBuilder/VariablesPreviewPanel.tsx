import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useState } from "react";

interface VariablesPreviewPanelProps {
  variables: Record<string, any>;
}

export function VariablesPreviewPanel({ variables }: VariablesPreviewPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyVariable = (varName: string) => {
    navigator.clipboard.writeText(`\${vars.${varName}}`);
    setCopied(varName);
    setTimeout(() => setCopied(null), 2000);
  };

  const entries = Object.entries(variables);
  const hasVariables = entries.length > 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Variables Preview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {!hasVariables ? (
          <div className="text-sm text-gray-400 text-center py-8">
            변수를 추가하면 여기에 표시됩니다
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map(([key, value]) => (
              <div
                key={key}
                className="p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <code className="text-xs font-mono text-blue-600">
                    ${'{vars.'}{key}{'}'}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => copyVariable(key)}
                  >
                    {copied === key ? '✓' : '📋'}
                  </Button>
                </div>
                <div className="text-xs text-gray-600 font-mono break-all">
                  = {typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}
                </div>
              </div>
            ))}
          </div>
        )}

        {hasVariables && (
          <div className="mt-4 p-3 bg-blue-50 rounded text-xs space-y-1">
            <div className="font-medium text-blue-900">💡 사용 방법:</div>
            <div className="text-blue-700">
              • Step의 selector, targetUrl 등에서 사용
            </div>
            <div className="text-blue-700">
              • 변수를 클릭하면 복사됩니다
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
