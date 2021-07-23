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
    children: [
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
    children: [
      {
        to: "/institutions",
        title: "Institutions",
        icon: <FaCircle {...childIconProps} />,
      },
      {
        to: "/students",
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
    children: [
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
    children: [
      {
        to: "/admin/states",
        title: "States",
        icon: <FaCircle {...childIconProps} />,
      },
      {
        to: "/admin/areas",
        title: "Areas",
        icon: <FaCircle {...childIconProps} />,
      },
      {
        to: "/admin/programs",
        title: "Programs",
        icon: <FaCircle {...childIconProps} />,
      },
      {
        to: "/admin/donors-and-grants",
        title: "Donors & Grants",
        icon: <FaCircle {...childIconProps} />,
      },
      {
        to: "/admin/discount-codes",
        title: "Discount Codes",
        icon: <FaCircle {...childIconProps} />,
      }
    ]
  },
];

const Sidebar = ({ isOpen }) => {
  const [activeFirstLevel, setActiveFirstLevel] = useState(() => {
    let activeRoute = routes.filter((route) => {
      if (route.children && route.children.length) {
        for (let i = 0; i < route.children.length; i++) {
          if (route.children[i].to === window.location.pathname) return true;
        }
      }
      return route.to === window.location.pathname;
    });
    return activeRoute.length ? activeRoute[0].title : "Dashboard"; // default to Dashboard
  });
  const sidenavClass = isOpen ? "" : "d-none d-md-block";
  return (
    <SideNav className={`sidebar ${sidenavClass}`} isOpen={isOpen}>
      <img
        src={require('../../assets/images/logo.png').default}
        alt="Medha SIS"
        className={isOpen ? '' : 'mx-auto d-block mt-3'}
        style={{width: isOpen ? '120px' : '60px', marginBottom: '30px'}}
      />
      <>
        {routes.map((route) => (
          <MenuItem {...route} key={route.title} isOpen={isOpen} activeFirstLevel={activeFirstLevel} setActiveFirstLevel={setActiveFirstLevel} />
        ))}
      </>
    </SideNav>
  )};

export default Sidebar;
