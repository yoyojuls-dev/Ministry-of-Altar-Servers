import getCurrentUser from "@/actions/getCurrentUser";
import NavBarClient from "./NavBarClient";

const NavBar = async () => {
  const currentUser = await getCurrentUser();

  return <NavBarClient currentUser={currentUser} />;
};

export default NavBar;