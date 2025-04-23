const isClient = typeof window !== "undefined";
import NavBar from "../Navbar/navBar";

import { useAuth } from "~/src/hooks/useUser";
export default function SafeNavbar() {
    const { isAuthenticated, user, signOut } = useAuth();
    if (!isClient) return null;
    return <NavBar
      userLoggedIn={isAuthenticated}
      userName={user?.nome} // ou user?.name, dependendo da sua estrutura
      userAvatar={user?.avatar}
      onLogout={signOut}
    />;
  }