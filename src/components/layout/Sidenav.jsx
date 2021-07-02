import styled from "styled-components";
import { MdDashboard } from "react-icons/md";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

import MenuItem from "./MenuItem";

const SideNav = styled.div`
  z-index: 1;
  height: 100%;
  align-self: stretch;
  background-color: #fff;
  transition: 0.15s ease-in;
  border-right: 2px solid #f2f2f2;
  width: ${(props) => (props.isOpen ? `250px` : "80px")};
`;

const iconStyle = {
  marginRight: "5px",
};

const iconProps = {
  size: 22,
  color: "#808080",
  style: { iconStyle },
};

const routes = [
  {
    to: "/",
    title: "Dashboard",
    icon: <MdDashboard {...iconProps} />,
  },
  {
    to: "/institutions",
    title: "Institutions",
    icon: <FaUserGraduate {...iconProps} />,
  },
  {
    to: "/batches",
    title: "Batches",
    icon: <FaChalkboardTeacher {...iconProps} />,
  },
];

const Sidebar = ({ isOpen }) => (
  <SideNav isOpen={isOpen}>
    <>
      {routes.map((route) => (
        <MenuItem {...route} key={route.title} isOpen={isOpen} />
      ))}
    </>
  </SideNav>
);

export default Sidebar;
