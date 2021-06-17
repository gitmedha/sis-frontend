import { Table } from "react-bootstrap";

const TableContainer = ({ children, striped }) => {
  return (
    <div className="card px-2 pt-2">
      <Table striped={striped}>{children}</Table>
    </div>
  );
};

export default TableContainer;
