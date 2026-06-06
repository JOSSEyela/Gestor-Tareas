import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("task/:id", "routes/task.$id.tsx"),
] satisfies RouteConfig;
