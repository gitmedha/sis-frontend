import styled from "styled-components";
import moment from 'moment';
import { useState, useMemo, useEffect } from "react";
import Table from "../../../components/content/Table";
import { Badge } from "../../../components/content/Utils";
import { FaBlackTie, FaBriefcase } from "react-icons/fa";
import { createEmploymentConnection, deleteEmploymentConnection, getEmploymentConnectionsPickList, updateEmploymentConnection } from "../../Students/StudentComponents/StudentActions";
import CreateEmploymentConnectionForm from "../../Students/StudentComponents/EmploymentConnectionForm";
import UpdateEmploymentConnectionForm from "../../Students/StudentComponents/EmploymentConnectionForm";
import EmploymentConnection from "./EmploymentConnection";
import { setAlert } from "../../../store/reducers/Notifications/actions";

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
  const [createModalShow, setCreateModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [pickList, setPickList] = useState([]);
  const [employmentConnectionsTableData, setEmploymentConnectionsTableData] = useState(employmentConnections);
  const [selectedEmploymentConnection, setSelectedEmploymentConnection] = useState({
    student: {},
  });

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

  const handleRowClick = employmentConnection => {
    setSelectedEmploymentConnection(employmentConnection);
    setViewModalShow(true);
  }

  const hideViewModal = () => {
    setViewModalShow(false);
  }

  const handleViewEdit = () => {
    setViewModalShow(false);
    setUpdateModalShow(true);
  }

  const handleViewDelete = () => {
    setViewModalShow(false);
    setShowDeleteAlert(true);
  }

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setCreateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let {id, employer, employer_id, opportunity_id, employment_connection_student, employment_connection_opportunity, registration_date_formatted, status_badge, role_or_designation, opportunity_icon, employer_name, assigned_to, ...dataToSave} = data;
    dataToSave['start_date'] = data.start_date ? moment(data.start_date).format("YYYY-MM-DD") : null;
    dataToSave['end_date'] = data.end_date ? moment(data.end_date).format("YYYY-MM-DD") : null;
    dataToSave['salary_offered'] = data.salary_offered ? Number(data.salary_offered) : null;
    dataToSave['opportunity'] = data.opportunity_id;
    dataToSave['student'] = selectedEmploymentConnection.student.id;

    createEmploymentConnection(dataToSave).then(data => {
      setAlert("Employment Connection created successfully.", "success");
    }).catch(err => {
      console.log("CREATE_EMPLOYMENT_CONNECTION_ERR", err);
      setAlert("Unable to create Employment Connection.", "error");
    }).finally(() => {
      onDataUpdate();
    });
    setCreateModalShow(false);
  };

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setUpdateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let {id, employer, employer_id, opportunity_id, employment_connection_student, employment_connection_opportunity, registration_date_formatted, status_badge, role_or_designation, opportunity_icon, employer_name, assigned_to, ...dataToSave} = data;
    dataToSave['start_date'] = data.start_date ? moment(data.start_date).format("YYYY-MM-DD") : null;
    dataToSave['end_date'] = data.end_date ? moment(data.end_date).format("YYYY-MM-DD") : null;
    dataToSave['salary_offered'] = data.salary_offered ? Number(data.salary_offered) : null;
    dataToSave['opportunity'] = data.opportunity_id;

    updateEmploymentConnection(Number(id), dataToSave).then(data => {
      setAlert("Employment Connection updated successfully.", "success");
    }).catch(err => {
      console.log("UPDATE_EMPLOYMENT_CONNECTION_ERR", err);
      setAlert("Unable to update Employment Connection.", "error");
    }).finally(() => {
      onDataUpdate();
    });
    setUpdateModalShow(false);
  };

  const handleDelete = async () => {
    deleteEmploymentConnection(selectedEmploymentConnection.id).then(data => {
      setAlert("Employment Connection deleted successfully.", "success");
    }).catch(err => {
      console.log("EMPLOYMENT_CONNECTION_DELETE_ERR", err);
      setAlert("Unable to delete Employment Connection.", "error");
    }).finally(() => {
      setShowDeleteAlert(false);
      onDataUpdate();
    });
  };

  return (
    <div className="container-fluid my-3">
      <Table columns={columns} data={employmentConnectionsTableData} paginationPageSize={employmentConnectionsTableData.length} totalRecords={employmentConnectionsTableData.length} fetchData={() => {}} loading={false} showPagination={false} onRowClick={handleRowClick} />
      <EmploymentConnection
        show={viewModalShow}
        onHide={hideViewModal}
        handleEdit={handleViewEdit}
        handleDelete={handleViewDelete}
        student={selectedEmploymentConnection.student}
        employmentConnection={selectedEmploymentConnection}
      />
      <CreateEmploymentConnectionForm
        show={createModalShow}
        onHide={hideCreateModal}
        student={selectedEmploymentConnection.student}
      />
      <UpdateEmploymentConnectionForm
        show={updateModalShow}
        onHide={hideUpdateModal}
        student={selectedEmploymentConnection.student}
        employmentConnection={selectedEmploymentConnection}
      />
    </div>
  );
};

export default EmploymentConnections;
