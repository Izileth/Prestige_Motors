const isClient = typeof window !== "undefined";
import NavBar from "../Navbar/navBar";
export default function SafeNavbar() {
    if (!isClient) return null;
    return <NavBar />;
  }