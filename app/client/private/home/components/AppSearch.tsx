import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "~/components/ui/input";

interface SubscriptionSearchCommandProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export function AppSearch({
  query,
  onQueryChange,
}: SubscriptionSearchCommandProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => (query ? [] : []), [query]);

  useEffect(() => {
    setOpen(!!(query && items.length));
  }, [query, items.length]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onQueryChange(query); // 리스트 매칭 상관없이 그대로 확정
      setOpen(false);
      return;
    }
    if (!open || !items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative w-full max-w-4xl">
      <Input
        placeholder="Find apps to see who uses them..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={() => items.length && setOpen(true)}
        onKeyDown={onKeyDown}
        className="w-full px-8 border border-gray-300 rounded-full py-6 text-base! focus-visible:border-gray-300! focus-visible:shadow-md focus-visible:ring-0"
        role="combobox"
        aria-expanded={open}
        aria-controls="app-search-listbox"
      />
    </div>
  );
}
