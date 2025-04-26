import Header from "./NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header /> {/* Navbar is included once in the Layout */}
      <main>
        <Outlet /> {/* This renders the child route components */}
      </main>
    </>
  );
};

export default Layout;
