import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import type { WorkflowType } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";

interface VariablesPreviewPanelProps {
  type: WorkflowType;
  workspaceKey: string;
  slug: string;
  emails: string;
  variables: Record<string, any>;
  onAddVariables: () => void;
  onAddParameters: () => void;
}

export function VariablesPreviewPanel({
  type,
  workspaceKey,
  slug,
  emails,
  variables,
  onAddVariables,
  onAddParameters,
}: VariablesPreviewPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyVariable = (varName: string) => {
    navigator.clipboard.writeText(`\${vars.${varName}}`);
    setCopied(varName);
    setTimeout(() => setCopied(null), 2000);
  };

  const entries = Object.entries(variables);
  const hasVariables = entries.length > 0;
  const needsParameters = [
    "WORKSPACE_DETAIL",
    "MEMBERS",
    "ADD_MEMBERS",
    "BILLING",
    "BILLING_HISTORIES",
  ].includes(type);

  const parameterRows = [
    {
      label: "Workspace Key",
      value: workspaceKey,
    },
    {
      label: "Slug",
      value: slug,
    },
    {
      label: "Emails",
      value: emails,
      hidden: type !== "ADD_MEMBERS",
    },
  ].filter((row) => !row.hidden);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <CardTitle>Variables</CardTitle>
          <Button size="sm" variant="outline" onClick={onAddVariables}>
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-6">
          <div className="space-y-2">
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
                        ${"{vars."}
                        {key}
                        {"}"}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => copyVariable(key)}
                      >
                        {copied === key ? "✓" : "📋"}
                      </Button>
                    </div>
                    <div className="text-xs text-gray-600 font-mono break-all">
                      ={" "}
                      {typeof value === "string"
                        ? `"${value}"`
                        : JSON.stringify(value)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
