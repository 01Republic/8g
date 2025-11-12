import "@xyflow/react/dist/style.css";
import WorkflowBuilderPage from "~/client/admin/workflowBuilder/WorkflowBuilderPage";
import type { Route } from "./+types/workflow-builder";
import type { FormWorkflow } from "~/models/workflow/types";
import { useFetcher } from "react-router";
import { useEffect } from "react";
import { redirect } from "react-router";
import { findWorkflowMetadata, upsertWorkflowMetadata } from "~/.server/services";
import { requireAuthSession } from "~/middleware/auth";
import type { WorkflowType } from "~/.server/db/entities/IntegrationAppWorkflowMetadata";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { token } = await requireAuthSession(request);

  const workflowId = params.workflowId
    ? parseInt(params.workflowId)
    : undefined;

  if (workflowId) {
    const workflow = await findWorkflowMetadata(workflowId, token);
    return {
      workflowId,
      workflow: workflow
        ? {
            id: workflow.id,
            description: workflow.description,
            meta: workflow.meta,
            type: workflow.type,
          }
        : null
    };
  }

  return {
    workflowId: undefined,
    workflow: null
  };
}

export async function action({ request }: Route.ActionArgs) {
  const { token } = await requireAuthSession(request);
  const formData = await request.formData();
  const workflowIdStr = formData.get("workflowId")?.toString();
  const workflowId = workflowIdStr ? parseInt(workflowIdStr) : undefined;
  const description = formData.get("description")!.toString();
  const meta = JSON.parse(formData.get("meta")!.toString()) as FormWorkflow;
  const typeStr = formData.get("type")?.toString() as WorkflowType | undefined;

  await upsertWorkflowMetadata(
    {
      workflowId,
      description,
      meta,
      type: typeStr || "WORKFLOW",
    },
    token,
  );

  return redirect("/");
}

export default function WorkflowBuilder({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const isSaving = fetcher.state !== "idle";

  const onSave = (payload: {
    workflowId?: number;
    description: string;
    meta: FormWorkflow;
    type?: WorkflowType;
  }) => {
    const { workflowId, description, meta, type } = payload;

    const formData = new FormData();
    if (workflowId) {
      formData.append("workflowId", workflowId.toString());
    }
    formData.append("description", description);
    formData.append("meta", JSON.stringify(meta));
    if (type) {
      formData.append("type", type);
    }
    fetcher.submit(formData, { method: "POST" });
  };

  useEffect(() => {
    if (fetcher.state !== "idle") return;
    if (!fetcher.data) return;
    const data = fetcher.data as any;
    const hasError = data && typeof data === "object" && "error" in data;
  }, [fetcher.state, fetcher.data]);

  return (
    <WorkflowBuilderPage
      workflowId={loaderData.workflowId}
      initialWorkflow={loaderData.workflow}
      onSave={onSave}
      isSaving={isSaving}
      type={loaderData.workflow?.type as WorkflowType | undefined}
    />
  );
}
