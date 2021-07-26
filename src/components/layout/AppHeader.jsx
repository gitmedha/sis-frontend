import styled from "styled-components";

import Userbox from "./Userbox";

const AppHeader = styled.div`
  z-index: 3;
  width: 100%;
  display: flex;
  positon: sticky;
  padding-left: 15px;
  padding-right: 15px;
  align-items: center;
  background-color: white;
  height: 70px !important;
  justify-content: flex-end;
  border-bottom: 2px solid #f2f2f2;
`;

const Header = ({ isOpen, toggleMenu }) => {
  return (
    <AppHeader>
      <Userbox />
    </AppHeader>
  );
};

export default Header;
