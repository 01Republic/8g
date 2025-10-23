import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { WorkflowType } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";

interface Product {
  id: number;
  nameKo: string;
  nameEn: string;
}

interface WorkflowBuilderHeaderProps {
  targetUrl: string;
  setTargetUrl: (url: string) => void;
  runWorkflow: () => void;
  isRunning: boolean;
  onAutoLayout?: () => void;
  onSaveClick: () => void;
  onVariablesClick: () => void;
  onExportClick: () => void;
  onImportClick: () => void;
  type?: WorkflowType;
  onApiTypeChange?: (type: WorkflowType) => void;
  productId: number;
  onProductIdChange: (id: number) => void;
  products: Product[];
  workspaceKey?: string;
  setWorkspaceKey?: (key: string) => void;
}

export const WorkflowBuilderHeader = ({
  targetUrl,
  setTargetUrl,
  runWorkflow,
  isRunning,
  onAutoLayout,
  onSaveClick,
  onVariablesClick,
  onExportClick,
  onImportClick,
  type = 'WORKFLOW',
  onApiTypeChange,
  productId,
  onProductIdChange,
  products,
  workspaceKey,
  setWorkspaceKey,
}: WorkflowBuilderHeaderProps) => {
  const typeLabels: Record<WorkflowType, string> = {
    WORKFLOW: '⚡ Data Collection',
    WORKSPACE: '🏢 Get Workspaces',
    MEMBERS: '👥 Get Members',
    PLAN: '💳 Plan & Cycle',
    BILLING: '📊 Billing History',
  };

  return (
    <>
      <Select
        value={productId.toString()}
        onValueChange={(value) => onProductIdChange(parseInt(value))}
      >
        <SelectTrigger style={{ width: 200 }}>
          <SelectValue placeholder="Select Product" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id.toString()}>
              {product.nameKo || product.nameEn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={type}
        onValueChange={(value) => onApiTypeChange?.(value as WorkflowType)}
      >
        <SelectTrigger style={{ width: 200 }}>
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="WORKFLOW">
            {typeLabels.WORKFLOW}
          </SelectItem>
          <SelectItem value="WORKSPACE">
            {typeLabels.WORKSPACE}
          </SelectItem>
          <SelectItem value="MEMBERS">
            {typeLabels.MEMBERS}
          </SelectItem>
          <SelectItem value="PLAN">
            {typeLabels.PLAN}
          </SelectItem>
          <SelectItem value="BILLING">
            {typeLabels.BILLING}
          </SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Target URL (기본: 현재 탭)"
        value={targetUrl}
        onChange={(e) => setTargetUrl(e.target.value)}
        style={{ maxWidth: 480 }}
      />
      {(type === 'MEMBERS' || type === 'PLAN' || type === 'BILLING') && (
        <Input
          placeholder="Workspace Key (필수)"
          value={workspaceKey || ''}
          onChange={(e) => setWorkspaceKey?.(e.target.value)}
          style={{ maxWidth: 240 }}
        />
      )}
      <Button onClick={runWorkflow} disabled={isRunning}>
        {isRunning ? "Running…" : "Run Workflow"}
      </Button>
      <Button variant="outline" onClick={onVariablesClick}>
        Variables
      </Button>
      <Button variant="outline" onClick={onExportClick}>
        Export JSON
      </Button>
      <Button variant="outline" onClick={onImportClick}>
        Import JSON
      </Button>
      <Button variant="outline" onClick={onSaveClick}>
        저장
      </Button>
      {onAutoLayout && (
        <Button variant="outline" onClick={onAutoLayout}>
          정렬
        </Button>
      )}
      <div style={{ marginLeft: "auto" }} />
    </>
  );
};
