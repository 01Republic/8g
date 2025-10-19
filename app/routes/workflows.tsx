import type { Route } from "./+types/workflows";
import WorkflowsPage from "~/client/admin/workflows/WorkflowsPage";
import { useFetcher } from "react-router";
import { deleteWorkflows } from "~/.server/services/workflow/delete-workflows.service";
import { findAllWorkflows } from "~/.server/services/workflow/find-all-workflows.service";

export async function loader() {
  const workflows = await findAllWorkflows();
  return { workflows };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const workflowId = parseInt(formData.get("workflowId")!.toString());
  await deleteWorkflows(workflowId);
}

export default function Workflows({ loaderData }: Route.ComponentProps) {
  const { workflows } = loaderData;
  const fetcher = useFetcher();

  const onDelete = async (workflowId: number) => {
    const formData = new FormData();
    formData.append("workflowId", workflowId.toString());
    fetcher.submit(formData, { method: "POST" });
  };

  return (
    <WorkflowsPage workflows={workflows as any} deleteWorkflows={onDelete} />
  );
}
