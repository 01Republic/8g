import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (description: string) => void;
  initialDescription?: string;
}

export function SaveDialog({
  open,
  onOpenChange,
  onSave,
  initialDescription = "",
}: SaveDialogProps) {
  const [description, setDescription] = useState(initialDescription);

  // open될 때마다 initialDescription으로 다시 설정
  useEffect(() => {
    if (open) {
      setDescription(initialDescription);
    }
  }, [open, initialDescription]);

  const handleSave = () => {
    if (!description.trim()) {
      alert("설명을 입력해주세요");
      return;
    }
    onSave(description);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>워크플로우 저장</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">설명</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="워크플로우 설명을 입력하세요"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
