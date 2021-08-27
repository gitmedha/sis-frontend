import styled from "styled-components";
import { useMemo } from "react";
import Table from "../../../components/content/Table";
import { Anchor } from "../../../components/content/Utils";

const Styled = styled.div`
  .img-profile-container {
    position: relative;
    .status-icon {
      position: absolute;
      top: 0;
      right: 0;
      padding: 1px 5px 5px 5px;
    }
    .img-profile {
      width: 160px;
      margin-left: auto;
    }
  }
  .separator {
    background-color: #C4C4C4;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  hr {
    height: 1px;
  }
`;

const EmploymentConnections = ({ employmentConnections }) => {

  const columns = useMemo(
    () => [
      {
        Header: 'Full Name',
        accessor: 'full_name',
      },
      {
        Header: 'Designation',
        accessor: 'designation',
      },
      {
        Header: 'Email',
        accessor: 'email_id',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
    ],
    []
  );

  return (
    <div className="container-fluid my-3">
      <Table columns={columns} data={employmentConnections} paginationPageSize={employmentConnections.length} totalRecords={employmentConnections.length} fetchData={() => {}} loading={false} showPagination={false} />
    </div>
  );
};

export default EmploymentConnections;
