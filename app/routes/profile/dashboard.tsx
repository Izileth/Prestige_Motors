import type { Route } from "./+types/dashboard";
import { UserDashboard } from "~/src/pages/Profile/dashboardPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Perfil - Dashboard | Prestige Motors" },
    { name: "description", content: "Confirme e redefina as suas informações" },
  ];
}

export default function ProfileDashborad() {
  return <UserDashboard/> ;
}
