import type { Route } from "./+types/login";
import ResetPasswordPage from "~/src/pages/Auth/resetPasswordChekPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Comfirmação das Alterações | Prestige Motors" },
    { name: "description", content: "Confirme e redefina as suas informações" },
  ];
}

export default function ConfirmReset() {
  return <ResetPasswordPage/> ;
}
