import styled from "styled-components";
import moment from 'moment';
import { useState, useMemo, useEffect } from "react";
import Table from "../../../components/content/Table";
import { deleteEmploymentConnection, getEmploymentConnectionsPickList, updateEmploymentConnection } from "./StudentActions";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { Badge } from "../../../components/content/Utils";
import SweetAlert from "react-bootstrap-sweetalert";
import EmploymentConnection from "./EmploymentConnection";
import CreateEmploymentConnectionForm from "./EmploymentConnectionForm";
import UpdateEmploymentConnectionForm from "./EmploymentConnectionForm";
import { FaBlackTie, FaBriefcase } from "react-icons/fa";

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

const EmploymentConnections = ({ employmentConnections, student, onDataUpdate }) => {
  const [createModalShow, setCreateModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [pickList, setPickList] = useState([]);
  const [employmentConnectionsTableData, setEmploymentConnectionsTableData] = useState(employmentConnections);
  const [selectedEmploymentConnection, setSelectedEmploymentConnection] = useState({});

  useEffect(() => {
    getEmploymentConnectionsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  useEffect(() => {
    let data = employmentConnections.map(employmentConnection => {
      return {
        ...employmentConnection,
        employer_name: employmentConnection.opportunity.employer.name,
        opportunity_icon: <OpportunityIcon opportunity={employmentConnection.opportunity} />,
        status_badge: <Badge value={employmentConnection.status} pickList={pickList.status} />,
        role_or_designation: employmentConnection.opportunity.role_or_designation,
        registration_date_formatted: moment(employmentConnection.registration_date).format("DD MMM YYYY"),
      };
    });
    setEmploymentConnectionsTableData(data);
  }, [employmentConnections, pickList]);

  const columns = useMemo(
    () => [
      {
        Header: 'Employer',
        accessor: 'employer_name',
      },
      {
        Header: 'Opportunity Type',
        accessor: 'opportunity_icon',
      },
      {
        Header: 'Status',
        accessor: 'status_badge',
      },
      {
        Header: 'Role/Designation',
        accessor: 'role_or_designation',
      },
      {
        Header: 'Registration Date',
        accessor: 'registration_date_formatted',
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
    setSelectedEmploymentConnection(programEnrollment);
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

    // // need to remove some data from the payload that's not accepted by the API
    // let {id, medha_program_certificate, medha_program_certificate_icon, program_enrollment_student, registration_date_formatted, batch_name, institution_name, status_badge, fee_status_badge, ...dataToSave} = data;
    // dataToSave['registration_date'] = data.registration_date ? moment(data.registration_date).format("YYYY-MM-DD") : null;
    // dataToSave['certification_date'] = data.certification_date ? moment(data.certification_date).format("YYYY-MM-DD") : null;
    // dataToSave['fee_payment_date'] = data.fee_payment_date ? moment(data.fee_payment_date).format("YYYY-MM-DD") : null;
    // dataToSave['fee_refund_date'] = data.fee_refund_date ? moment(data.fee_refund_date).format("YYYY-MM-DD") : null;
    // dataToSave['fee_amount'] = data.fee_refund_date ? Number(data.fee_amount) : null;
    // dataToSave['student'] = student.id;

    // // NP.start();
    // createProgramEnrollment(dataToSave).then(data => {
    //   setAlert("Program Enrollment created successfully.", "success");
    // }).catch(err => {
    //   console.log("CREATE_PROGRAM_ENROLLMENT_ERR", err);
    //   setAlert("Unable to create program Enrollment.", "error");
    // }).finally(() => {
    //   // NP.done();
    //   onDataUpdate();
    // });
    // setCreateModalShow(false);
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
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCreateModalShow(true)}
          >
            + Map Students
          </button>
        </div>
      </div>
      <Table columns={columns} data={employmentConnectionsTableData} paginationPageSize={employmentConnectionsTableData.length} totalRecords={employmentConnectionsTableData.length} fetchData={() => {}} loading={false} showPagination={false} onRowClick={handleRowClick} />
      <EmploymentConnection
        show={viewModalShow}
        onHide={hideViewModal}
        handleEdit={handleViewEdit}
        handleDelete={handleViewDelete}
        student={student}
        employmentConnection={selectedEmploymentConnection}
      />
      <CreateEmploymentConnectionForm
        show={createModalShow}
        onHide={hideCreateModal}
        student={student}
      />
      <UpdateEmploymentConnectionForm
        show={updateModalShow}
        onHide={hideUpdateModal}
        student={student}
        employmentConnection={selectedEmploymentConnection}
      />
      <SweetAlert
          danger
          showCancel
          btnSize="md"
          show={showDeleteAlert}
          onConfirm={() => handleDelete()}
          onCancel={() => setShowDeleteAlert(false)}
          title={
            <span className="text--primary latto-bold">Delete Employment Connection?</span>
          }
          customButtons={
            <>
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="btn btn-secondary mx-2 px-4"
              >
                Cancel
              </button>
              <button onClick={() => handleDelete()} className="btn btn-danger mx-2 px-4">
                Delete
              </button>
            </>
          }
        >
          <p>Are you sure?</p>
        </SweetAlert>
    </div>
  );
};

export default EmploymentConnections;
