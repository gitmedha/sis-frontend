import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <>{children}</>
      </div>
    </div>
  );
};

export default Layout;
