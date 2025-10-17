import "@xyflow/react/dist/style.css";
import WorkflowBuilderPage from "~/client/admin/workflowBuilder/WorkflowBuilderPage";
import type { Route } from "./+types/workflow-builder";
import {
  upsertWorkflowMetadata,
  findWorkflowMetadata,
} from "~/.server/services";
import type { FormWorkflow } from "~/models/integration/types";
import { useFetcher } from "react-router";
import { useEffect } from "react";
import { redirect } from "react-router";
import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

export async function loader({ params }: Route.LoaderArgs) {
  const workflowId = params.workflowId
    ? parseInt(params.workflowId)
    : undefined;

  if (workflowId) {
    const response = await axios.get(`${BASE_URL}/8g/workflow/${workflowId}`);
    const workflow = response.data;
    return {
      workflowId,
      workflow: workflow
        ? {
            id: workflow.id,
            description: workflow.description,
            meta: workflow.meta,
          }
        : null,
    };
  }

  return {
    workflowId: undefined,
    workflow: null,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const workflowIdStr = formData.get("workflowId")?.toString();
  const workflowId = workflowIdStr ? parseInt(workflowIdStr) : undefined;
  const description = formData.get("description")!.toString();
  const meta = JSON.parse(formData.get("meta")!.toString()) as FormWorkflow;

  await axios.post(`${BASE_URL}/8g/workflow`, {
    workflowId,
    description,
    meta,
  });

  return redirect("/workflows");
}

export default function WorkflowBuilder({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const isSaving = fetcher.state !== "idle";

  const onSave = (payload: {
    workflowId?: number;
    description: string;
    meta: FormWorkflow;
  }) => {
    const { workflowId, description, meta } = payload;

    const formData = new FormData();
    if (workflowId) {
      formData.append("workflowId", workflowId.toString());
    }
    formData.append("description", description);
    formData.append("meta", JSON.stringify(meta));
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
    />
  );
}
