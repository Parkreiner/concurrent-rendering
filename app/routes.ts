import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("Layout.tsx", [
    index("routes/home.tsx"),
    route("vanilla", "routes/vanilla.tsx"),
    route("memo-only", "routes/memoOnly.tsx"),
    route("transition-only", "routes/transitionOnly.tsx"),
    route("transition-with-memo", "routes/transitionWithMemo.tsx"),
    route("defer-only", "routes/deferOnly.tsx"),
    route("defer-with-memo", "routes/deferWithMemo.tsx"),
  ]),
] satisfies RouteConfig;
