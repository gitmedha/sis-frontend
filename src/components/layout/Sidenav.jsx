import React, { useState } from 'react';
import styled from "styled-components";
import { MdDashboard } from "react-icons/md";
import { FaUserGraduate, FaChalkboardTeacher, FaUserCog, FaUserTie, FaCircle } from "react-icons/fa";
import MenuItem from "./MenuItem";

const SideNav = styled.div`
  z-index: 1;
  height: 100%;
  align-self: stretch;
  background-color: #fff;
  transition: 0.15s ease-in;
  border-right: 2px solid #f2f2f2;
  width: ${(props) => (props.isOpen ? `275px` : "80px")};
`;

const iconStyle = {
  marginRight: "5px",
};

const iconProps = {
  size: 24,
  style: { iconStyle },
};
const childIconProps = {
    size: 10,
    style: { iconStyle },
  };

const routes = [
  {
    to: "/",
    title: "Dashboard",
    icon: <MdDashboard {...iconProps} />,
    subMenu: [
        {
          to: "/#keyMetrics",
          title: "Key Metrics",
          icon: <FaCircle {...childIconProps} />,
        },
        {
          to: "/#newOpportunities",
          title: "New Opportunities",
          icon: <FaCircle {...childIconProps} />,
        },
        {
          to: "/#newlyCertifiedStudents",
          title: "Newly Certified Students",
          icon: <FaCircle {...childIconProps} />,
        }
    ]
  },
  {
    to: "/students",
    title: "Students",
    icon: <FaUserGraduate {...iconProps} />,
    subMenu: [
      {
        to: "/institutions",
        title: "Institutions",
        icon: <FaCircle {...childIconProps} />,
      },
      {
        to: "/students-alumni",
        title: "Students & Alumni",
        icon: <FaCircle {...childIconProps} />,
      },
    ]
  },
  {
    to: "/batches",
    title: "Batches",
    icon: <FaChalkboardTeacher {...iconProps} />,
  },
  {
    to: "/employers",
    title: "Employers",
    icon: <FaUserTie {...iconProps} />,
    subMenu: [
      {
        to: "/employers",
        title: "Employers",
        icon: <FaCircle {...childIconProps} />,
      },
      {
        to: "/opportunities",
        title: "Opportunities",
        icon: <FaCircle {...childIconProps} />,
      }
    ]
  },
  {
    to: "/admin",
    title: "Admin",
    icon: <FaUserCog {...iconProps} />,
  },
];

const Sidebar = ({ isOpen }) => {
  const [activeParent, setActiveParent] = useState(null);
  return (
    <SideNav className="sidebar" isOpen={isOpen}>
      <img
        src={require('../../assets/images/logo.png').default}
        alt="Medha SIS"
        className={isOpen ? '' : 'mx-auto d-block mt-3'}
        style={{width: isOpen ? '120px' : '60px', marginBottom: '30px'}}
      />
      <>
        {routes.map((route) => (
          <MenuItem {...route} key={route.title} isOpen={isOpen} activeParent={activeParent} setActiveParent={setActiveParent} />
        ))}
      </>
    </SideNav>
  )};

export default Sidebar;
