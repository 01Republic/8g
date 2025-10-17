import type { Route } from "./+types/workflows";
import { authMiddleware } from "~/middleware/auth";
import WorkflowsPage from "~/client/admin/workflows/WorkflowsPage";
import { useFetcher } from "react-router";
import axios from "axios";

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

export async function loader() {
  const response = await axios.get(`${BASE_URL}/8g/workflow`);
  const workflows = response.data;
  return { workflows };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const workflowId = parseInt(formData.get("workflowId")!.toString());
  await axios.delete(`${BASE_URL}/8g/workflow/${workflowId}`);
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
