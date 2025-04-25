import { useAuth } from "~/src/hooks/useUser";
import NavBar from "../Navbar/navBar";
export default function SafeNavbar() {
  const isClient = typeof window !== "undefined";
  if (!isClient) return null;
  
  // Somente chame hooks após verificar o ambiente
  const { isAuthenticated, user, signOut } = useAuth();
  
  return <NavBar
  />;
}