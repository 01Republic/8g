import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("layouts/sidebar.tsx", [
        index("routes/home.tsx"),
        route("/integration", "routes/integration.tsx"),
        route("/apps", "routes/apps.tsx"),
        route("/workflow", "routes/workflow.tsx"),
        route("/apps/:appId/form-builder", "routes/form-builder.tsx"),
    ]),
    layout("layouts/common.tsx", [
        route("/login", "routes/login.tsx")
    ])
] satisfies RouteConfig;
