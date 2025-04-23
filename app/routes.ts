import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/hero.tsx"),

    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
    route("forgot-password", "routes/auth/password.tsx"),
    route("reset-password", "routes/auth/reset.tsx"),

    route("dashboard", "routes/profile/dashboard.tsx"),
] satisfies RouteConfig;
