import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type SubtreeRole = "start" | "middle" | "end-neighbor";

type SubtreePreviewState = {
  previewId: string | null;
  roles: Record<string, SubtreeRole>;
};

type SubtreePreviewContextValue = {
  preview: SubtreePreviewState;
  setPreview: (next: SubtreePreviewState) => void;
  clearPreview: (previewId?: string) => void;
};

const defaultState: SubtreePreviewState = {
  previewId: null,
  roles: {},
};

const SubtreePreviewContext = createContext<SubtreePreviewContextValue>({
  preview: defaultState,
  setPreview: () => {},
  clearPreview: () => {},
});

export function SubtreePreviewProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [preview, setPreviewState] = useState<SubtreePreviewState>(defaultState);

  const setPreview = useCallback((next: SubtreePreviewState) => {
    setPreviewState(next);
  }, []);

  const clearPreview = useCallback((previewId?: string) => {
    setPreviewState((prev) => {
      if (previewId && prev.previewId && prev.previewId !== previewId) {
        return prev;
      }
      if (!prev.previewId) {
        return prev;
      }
      return defaultState;
    });
  }, []);

  return (
    <SubtreePreviewContext.Provider
      value={{ preview, setPreview, clearPreview }}
    >
      {children}
    </SubtreePreviewContext.Provider>
  );
}

export function useSubtreePreview() {
  return useContext(SubtreePreviewContext);
}


