import type { Route } from "./+types/login";
import ForgotPasswordPage from "~/src/pages/Auth/resetPasswordPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Redefinição de Senha | Prestige Motors" },
    { name: "description", content: "Recupere a sua conta" },
  ];
}

export default function ResetPassword() {
  return <ForgotPasswordPage/> ;
}
