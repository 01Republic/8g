import React from "react";
import { Handle, Position, type NodeProps, type Node, useReactFlow } from "@xyflow/react";
import { type GetTextBlock } from "8g-extension";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";

type GetTextNodeData = {
  block: GetTextBlock;
  title?: string;
};

type GetTextNodeType = Node<GetTextNodeData, "get-text">;

export default function GetTextNode({ id, data, selected }: NodeProps<GetTextNodeType>) {
  const { block } = data;
  const title = data.title ?? "Get Text";
  const { setNodes } = useReactFlow();

  const [open, setOpen] = React.useState(false);
  const [selector, setSelector] = React.useState(block.selector ?? "");
  const [findBy, setFindBy] = React.useState<GetTextBlock["findBy"]>((block.findBy as any) ?? "cssSelector");
  const [useTextContent, setUseTextContent] = React.useState<boolean>((block as any).useTextContent ?? false);
  const [includeTags, setIncludeTags] = React.useState<boolean>((block as any).includeTags ?? false);
  const [regex, setRegex] = React.useState<string>(block.regex ?? "");
  const [prefixText, setPrefixText] = React.useState<string>(block.prefixText ?? "");
  const [suffixText, setSuffixText] = React.useState<string>(block.suffixText ?? "");
  const [waitForSelector, setWaitForSelector] = React.useState<boolean>(Boolean(block.option?.waitForSelector));
  const [waitSelectorTimeout, setWaitSelectorTimeout] = React.useState<string>(
    typeof block.option?.waitSelectorTimeout === "number" ? String(block.option?.waitSelectorTimeout) : ""
  );
  const [multiple, setMultiple] = React.useState<boolean>(Boolean(block.option?.multiple));

  const onOpenChange = (next: boolean) => {
    if (next) {
      setSelector(block.selector ?? "");
      setFindBy(((block.findBy as any) ?? "cssSelector") as GetTextBlock["findBy"]);
      setUseTextContent((block as any).useTextContent ?? false);
      setIncludeTags((block as any).includeTags ?? false);
      setRegex(block.regex ?? "");
      setPrefixText(block.prefixText ?? "");
      setSuffixText(block.suffixText ?? "");
      setWaitForSelector(Boolean(block.option?.waitForSelector));
      setWaitSelectorTimeout(typeof block.option?.waitSelectorTimeout === "number" ? String(block.option?.waitSelectorTimeout) : "");
      setMultiple(Boolean(block.option?.multiple));
    }
    setOpen(next);
  };

  const handleSave = () => {
    const nextBlock: GetTextBlock = {
      ...(block as any),
      name: "get-text",
      selector,
      findBy,
      option: {
        ...(block as any).option,
        waitForSelector,
        waitSelectorTimeout: waitSelectorTimeout === "" ? undefined : Number(waitSelectorTimeout),
        multiple,
      },
      useTextContent,
      includeTags,
      regex: regex || undefined,
      prefixText: prefixText || undefined,
      suffixText: suffixText || undefined,
    } as any;

    setNodes(prev => prev.map(n => {
      if (n.id !== id) return n;
      return {
        ...n,
        data: {
          ...n.data,
          block: nextBlock,
        },
      } as any;
    }));
    setOpen(false);
  };

  return (
    <div
      style={{
        border: selected ? "2px solid #4f46e5" : "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#ffffff",
        minWidth: 220,
        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
        <span
          style={{
            fontSize: 10,
            color: "#6b7280",
            background: "#f3f4f6",
            padding: "2px 6px",
            borderRadius: 999,
          }}
        >
          get-text
        </span>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Edit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit Get Text</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="selector">Selector</Label>
                <Input id="selector" value={selector} onChange={(e) => setSelector(e.target.value)} placeholder="#title" />
              </div>
              <div className="grid gap-2">
                <Label>Find By</Label>
                <Select value={findBy} onValueChange={(v) => setFindBy(v as GetTextBlock["findBy"])}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cssSelector">cssSelector</SelectItem>
                    <SelectItem value="xpath">xpath</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Options</Label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={waitForSelector} onChange={(e) => setWaitForSelector(e.target.checked)} />
                  <span>waitForSelector</span>
                </label>
                <div className="grid gap-2">
                  <Label htmlFor="waitSelectorTimeout">waitSelectorTimeout (ms)</Label>
                  <Input
                    id="waitSelectorTimeout"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={waitSelectorTimeout}
                    onChange={(e) => setWaitSelectorTimeout(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="2000"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={multiple} onChange={(e) => setMultiple(e.target.checked)} />
                  <span>multiple</span>
                </label>
              </div>
      <div className="grid gap-2">
        <Label htmlFor="regex">Regex</Label>
        <Input id="regex" value={regex} onChange={(e) => setRegex(e.target.value)} placeholder="^OK$" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="prefix">Prefix Text</Label>
        <Input id="prefix" value={prefixText} onChange={(e) => setPrefixText(e.target.value)} placeholder="Title: " />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="suffix">Suffix Text</Label>
        <Input id="suffix" value={suffixText} onChange={(e) => setSuffixText(e.target.value)} placeholder=" - end" />
      </div>
              <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={useTextContent} onChange={(e) => setUseTextContent(e.target.checked)} />
                  <span>useTextContent</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={includeTags} onChange={(e) => setIncludeTags(e.target.checked)} />
                  <span>includeTags</span>
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div style={{ padding: 12, display: "grid", rowGap: 8 }}>
        <Row label="selector" value={block.selector ?? "-"} />
        <Row label="findBy" value={String(block.findBy ?? "cssSelector")} />
        {typeof block.option?.waitForSelector !== "undefined" ? (
          <Row label="waitForSelector" value={String(block.option?.waitForSelector)} />
        ) : null}
        {typeof block.option?.waitSelectorTimeout !== "undefined" ? (
          <Row label="waitSelectorTimeout" value={String(block.option?.waitSelectorTimeout)} />
        ) : null}
        {typeof block.option?.multiple !== "undefined" ? (
          <Row label="multiple" value={String(block.option?.multiple)} />
        ) : null}
        {"useTextContent" in block && (
          <Row label="useTextContent" value={String((block as any).useTextContent ?? false)} />
        )}
        {"includeTags" in block && (
          <Row label="includeTags" value={String((block as any).includeTags ?? false)} />
        )}
        {block.regex ? <Row label="regex" value={block.regex} /> : null}
        {block.prefixText ? <Row label="prefixText" value={block.prefixText} /> : null}
        {block.suffixText ? <Row label="suffixText" value={block.suffixText} /> : null}
      </div>

      <Handle type="target" position={Position.Top} style={{ borderRadius: 4, width: 8, height: 8 }} />
      <Handle type="source" position={Position.Bottom} style={{ borderRadius: 4, width: 8, height: 8 }} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", columnGap: 10, alignItems: "center" }}>
      <span style={{ fontSize: 11, color: "#6b7280" }}>{label}</span>
      <span style={{ fontSize: 12, color: "#111827", wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}