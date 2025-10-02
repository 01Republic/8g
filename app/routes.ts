import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/sidebar.tsx", [
    index("routes/home.tsx"),
    route("/integration", "routes/integration.tsx"),
    route("/apps", "routes/apps.tsx"),
    route("/apps/:appId", "routes/app-detail.tsx"),
    route("/workflows", "routes/workflows.tsx"),
    route("/workflow-builder/:workflowId?", "routes/workflow-builder.tsx"),
    route("/apps/:appId/form-builder", "routes/form-builder.tsx"),
  ]),
  layout("layouts/common.tsx", [route("/login", "routes/login.tsx")]),
  route("/not-found", "routes/not-found.tsx"),
] satisfies RouteConfig;
