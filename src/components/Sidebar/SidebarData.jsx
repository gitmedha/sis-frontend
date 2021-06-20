import {
  FaUserCog,
  FaUserTie,
  FaAngleUp,
  FaAngleDown,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";
import DashboardIcon from "@material-ui/icons/Dashboard";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/",
    icon: <DashboardIcon />,
    iconClosed: <FaAngleDown color={"#808080"} />,
    iconOpened: <FaAngleUp color={"#000"} />,
    subNav: [
      {
        title: "Key Matrices",
        path: "/key-matrices",
      },
      {
        title: "New Opportunities",
        path: "/new-opportunities",
      },
      {
        title: "Newly Certified Students",
        path: "/nee-certified-students",
      },
    ],
  },
  {
    title: "Students",
    path: "/institutions",
    icon: <FaUserGraduate size={20} color={"#808080"} />,
    iconClosed: <FaAngleDown color={"#808080"} />,
    iconOpened: <FaAngleUp color={"#808080"} />,
    subNav: [
      {
        title: "Institutions",
        path: "/institutions",
      },
    ],
  },
  {
    title: "Batches",
    path: "/batches",
    icon: <FaChalkboardTeacher size={20} color={"#808080"} />,
    iconClosed: <FaAngleDown color={"#808080"} />,
    iconOpened: <FaAngleUp color={"#808080"} />,
    subNav: [
      {
        title: "Reports",
        path: "/reports/reports1",
      },
    ],
  },
  {
    title: "Employer",
    path: "/employer",
    icon: <FaUserTie size={20} color={"#808080"} />,
    iconClosed: <FaAngleDown color={"#808080"} />,
    iconOpened: <FaAngleUp color={"#808080"} />,
    subNav: [
      {
        title: "Reports",
        path: "/reports/reports1",
      },
    ],
  },
  {
    title: "Admin",
    path: "/admin",
    icon: <FaUserCog size={20} color={"#808080"} />,
    iconClosed: <FaAngleDown color={"#808080"} />,
    iconOpened: <FaAngleUp color={"#808080"} />,
    subNav: [
      {
        title: "Message 1",
        path: "/messages/message1",
      },
      {
        title: "Message 2",
        path: "/messages/message2",
      },
    ],
  },
];
