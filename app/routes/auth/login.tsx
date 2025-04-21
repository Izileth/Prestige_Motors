import type { Route } from "./+types/login";
import LoginPage from "~/src/pages/Auth/loginPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | Prestige Motors" },
    { name: "description", content: "Faça o Login para acessar o seu perfil" },
  ];
}

export default function Login() {
  return <LoginPage/> ;
}
