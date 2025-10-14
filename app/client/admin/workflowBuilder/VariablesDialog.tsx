import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useState } from "react";

interface VariablesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variables: Record<string, any>;
  onVariablesChange: (vars: Record<string, any>) => void;
}

export function VariablesDialog({
  open,
  onOpenChange,
  variables,
  onVariablesChange,
}: VariablesDialogProps) {
  const [entries, setEntries] = useState<Array<[string, string]>>(
    Object.entries(variables || {}).map(([k, v]) => [k, String(v)]),
  );

  const handleAdd = () => {
    const newEntries = [...entries, ["newVar", ""] as [string, string]];
    setEntries(newEntries);
  };

  const handleUpdate = (index: number, key: string, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = [key, value];
    setEntries(newEntries);
    onVariablesChange(Object.fromEntries(newEntries));
  };

  const handleRemove = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    onVariablesChange(Object.fromEntries(newEntries));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Workflow Variables</DialogTitle>
          <DialogDescription>
            워크플로우에서 사용할 변수를 정의하세요. Step에서 $
            {"${vars.변수명}"} 형식으로 참조할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {entries.map(([key, value], index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="변수명"
                value={key}
                onChange={(e) => handleUpdate(index, e.target.value, value)}
                className="w-40 font-mono text-sm"
              />
              <span className="text-gray-400">=</span>
              <Input
                placeholder="테스트 값"
                value={value}
                onChange={(e) => handleUpdate(index, key, e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
              >
                🗑️
              </Button>
            </div>
          ))}

          <Button
            onClick={handleAdd}
            variant="outline"
            size="sm"
            className="w-full"
          >
            + 변수 추가
          </Button>
        </div>

        <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
          <div className="font-medium">사용 예시:</div>
          <div className="space-y-1">
            <code className="text-xs block">
              selector: "#workspace-${"${vars.workspaceId}"}-permission"
            </code>
            <code className="text-xs block">
              targetUrl: "https://api.com/${"${vars.workspaceId}"}/data"
            </code>
            <code className="text-xs block">
              setValue: "${"${vars.userName}"}"
            </code>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={() => onOpenChange(false)}>완료</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
