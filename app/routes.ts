import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("Layout.tsx", [
    index("routes/home.tsx"),
    route("start", "routes/start.tsx"),
    route("memo-only", "routes/memoOnly.tsx"),
    route("defer-only", "routes/deferredOnly.tsx"),
    route("defer-and-memo", "routes/deferredWithMemo.tsx"),
  ]),
] satisfies RouteConfig;
