import type { Route } from "./+types/login";
import LoginPage from "~/src/pages/Auth/loginPage";
import { MemoryRouter } from 'react-router-dom';
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | Prestige Motors" },
    { name: "description", content: "Faça o Login para acessar o seu perfil" },
  ];
}

export default function Login() {
  return (
    <MemoryRouter>
      <LoginPage/>
    </MemoryRouter>
  );
}
