import HeaderContainer from "@/containers/HeaderContainer";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <>
      <HeaderContainer />
      <Outlet />
    </>
  );
};

export default AppLayout;
