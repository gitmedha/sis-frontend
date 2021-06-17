import { useState } from "react";
import SubMenu from "./SidebarMenu";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons/lib";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";

const Nav = styled.div`
  height: 80px;
  display: flex;
  background: #fff;
  align-items: center;
  justify-content: flex-start;
  border: 2px solid #f5f5f5;
`;

const NavIcon = styled(Link)`
  height: 80px;
  display: flex;
  font-size: 2rem;
  margin-left: 2rem;
  align-items: center;
  justify-content: flex-start;
`;

const SidebarNav = styled.nav`
  top: 0;
  z-index: 10;
  width: 250px;
  height: 100vh;
  display: flex;
  position: fixed;
  background: #fff;
  transition: 350ms;
  justify-content: center;
  border-right: 2px solid #f5f5f5;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
          <NavIcon to="#">
            <MenuIcon style={{ color: "#207B69" }} onClick={showSidebar} />
          </NavIcon>
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to="#">
              <CloseIcon style={{ color: "#207B69" }} onClick={showSidebar} />
            </NavIcon>
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
