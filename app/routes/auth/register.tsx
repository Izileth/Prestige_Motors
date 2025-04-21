import type { Route } from "./+types/register";
import RegisterPage from "~/src/pages/Auth/registerPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Registro | Prestige Motors" },
    { name: "description", content: "Crue uma conta e começe a anunicar hoje" },
  ];
}

export default function Register() {
  return <RegisterPage/> ;
}
