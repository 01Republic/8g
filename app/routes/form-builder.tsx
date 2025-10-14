import type { Route } from "./+types/form-builder";
import FormBuilderPage from "~/client/admin/formBuilder/FormBuilderPage";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { AppFormMetadata } from "~/models/integration/types";
import {
  findAllFormMetadata,
  upsertFormMetadata,
  findAllWorkflows,
} from "~/.server/services";

export async function loader({ params }: Route.LoaderArgs) {
  const [formMetadata, workflows] = await Promise.all([
    findAllFormMetadata(params.appId),
    findAllWorkflows(),
  ]);

  return {
    ...formMetadata,
    workflows,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const appId = formData.get("appId")!.toString();
  const meta = JSON.parse(formData.get("meta")!.toString());
  const isActive = formData.get("isActive")!.toString() === "true";

  await upsertFormMetadata(appId, meta, isActive);

  return {
    appId,
    meta,
    isActive,
  };
}

export default function FormBuilder({ loaderData }: Route.ComponentProps) {
  const { appId, initialMeta, isActive, workflows } = loaderData;

  const fetcher = useFetcher();
  const isSaving = fetcher.state !== "idle";
  const [saveDialog, setSaveDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({ open: false, title: "", message: "" });

  // 이 부분이랑 formData 관련된 부분도 공통으로 뺄 수 있을 듯
  const onSave = (payload: {
    appId: string;
    meta: AppFormMetadata;
    isActive: boolean;
  }) => {
    const { appId, meta, isActive } = payload;

    const formData = new FormData();
    formData.append("appId", appId);
    formData.append("meta", JSON.stringify(meta));
    formData.append("isActive", String(isActive));
    fetcher.submit(formData, { method: "POST" });
  };

  // 이 부분은 차후 컴포넌트로 분리할 수 있을 거 같음
  useEffect(() => {
    if (fetcher.state !== "idle") return;
    if (!fetcher.data) return;
    const data = fetcher.data as any;
    const hasError = data && typeof data === "object" && "error" in data;
    setSaveDialog({
      open: true,
      title: hasError ? "저장 실패" : "저장 완료",
      message: hasError
        ? (data?.error as string) || "저장 중 오류가 발생했습니다."
        : "메타데이터가 저장되었습니다.",
    });
  }, [fetcher.state, fetcher.data]);

  const onCloseDialog = () => setSaveDialog((p) => ({ ...p, open: false }));

  return (
    <FormBuilderPage
      appId={appId}
      initialMetadata={initialMeta}
      onSave={onSave}
      isSaving={isSaving}
      saveDialog={saveDialog}
      onCloseDialog={onCloseDialog}
      isRunning={isActive || false}
      workflows={workflows as any}
    />
  );
}
