import styled from "styled-components";
import moment from 'moment';
import { useState, useMemo, useEffect } from "react";
import Table from "../../../components/content/Table";
import { Badge } from "../../../components/content/Utils";
import { FaBlackTie, FaBriefcase } from "react-icons/fa";
import { getEmploymentConnectionsPickList } from "../../Students/StudentComponents/StudentActions";

const StyledOpportunityIcon = styled.div`
  border-radius: 50%;
  height: 35px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OpportunityIcon = ({opportunity}) => {
  let bgColor = '#FF9700';
  let icon = null;
  switch (opportunity.type) {
    case 'Job':
      bgColor = '#FF9700';
      icon = <FaBriefcase color="#ffffff" size="16" />;
      break;

    case 'Internship':
      bgColor = '#12314C';
      icon = <FaBlackTie color="#ffffff" size="16" />;
      break;
  }
  if (icon) {
    return <StyledOpportunityIcon style={{backgroundColor: bgColor}}>
      {icon}
    </StyledOpportunityIcon>;
  }
  return <></>;
};

const EmploymentConnections = ({ employmentConnections, opportunity, onDataUpdate }) => {
  const [pickList, setPickList] = useState([]);
  const [employmentConnectionsTableData, setEmploymentConnectionsTableData] = useState(employmentConnections);

  useEffect(() => {
    getEmploymentConnectionsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  useEffect(() => {
    let data = employmentConnections.map(employmentConnection => {
      return {
        ...employmentConnection,
        student_name: employmentConnection.student ? `${employmentConnection.student.first_name} ${employmentConnection.student.last_name}` : '',
        institution_name: 'To be added',
        opportunity_icon: employmentConnection.opportunity ? <OpportunityIcon opportunity={employmentConnection.opportunity} /> : '',
        status_badge: <Badge value={employmentConnection.status} pickList={pickList.status} />,
        role_or_designation: employmentConnection.opportunity ? employmentConnection.opportunity.role_or_designation : '',
        registration_date_formatted: moment(employmentConnection.registration_date).format("DD MMM YYYY"),
        date: moment(employmentConnection.created_at).format("DD MMM YYYY"),
      };
    });
    setEmploymentConnectionsTableData(data);
  }, [employmentConnections, pickList]);

  const columns = useMemo(
    () => [
      {
        Header: 'Student',
        accessor: 'student_name',
      },
      {
        Header: 'Institution',
        accessor: 'institution_name',
      },
      {
        Header: 'Status',
        accessor: 'status_badge',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: '',
        accessor: 'link',
        disableSortBy: true,
      },
    ],
    []
  );

  const handleRowClick = programEnrollment => {
    // setSelectedEmploymentConnection(programEnrollment);
    // setViewModalShow(true);
  }

  return (
    <div className="container-fluid my-3">
      <Table columns={columns} data={employmentConnectionsTableData} paginationPageSize={employmentConnectionsTableData.length} totalRecords={employmentConnectionsTableData.length} fetchData={() => {}} loading={false} showPagination={false} onRowClick={handleRowClick} />
      {/* <EmploymentConnection
        show={viewModalShow}
        onHide={hideViewModal}
        handleEdit={handleViewEdit}
        handleDelete={handleViewDelete}
        student={student}
        employmentConnection={selectedEmploymentConnection}
      /> */}
    </div>
  );
};

export default EmploymentConnections;
