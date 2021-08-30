import styled from "styled-components";
import moment from 'moment';
import { useState, useMemo, useEffect } from "react";
import Table from "../../../components/content/Table";
import { FaDownload } from "react-icons/fa";
import CreateProgramEnrollmentForm from "./ProgramEnrollmentForm";
import UpdateProgramEnrollmentForm from "./ProgramEnrollmentForm";
import { createProgramEnrollment, updateProgramEnrollment } from "./StudentActions";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { Badge } from "../../../components/content/Utils";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";

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

const ProgramEnrollments = ({ programEnrollments, student, onDataUpdate }) => {
  const [createModalShow, setCreateModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [pickList, setPickList] = useState([]);
  const [programEnrollmentsTableData, setProgramEnrollmentsTableData] = useState(programEnrollments);
  const [programEnrollmentUpdateFormData, setProgramEnrollmentUpdateFormData] = useState({});

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  useEffect(() => {
    let data = programEnrollments.map(programEnrollment => {
      return {
        ...programEnrollment,
        registration_date_formatted: moment(programEnrollment.registration_date).format("DD MMM YYYY"),
        batch_name: programEnrollment.batch.name,
        institution_name: programEnrollment.institution.name,
        status_badge: <Badge value={programEnrollment.status} pickList={pickList.status} />,
        fee_status_badge: <Badge value={programEnrollment.fee_status} pickList={pickList.fee_status} />,
        medha_program_certificate: <FaDownload size="20" color="#31B89D" />,
      };
    });
    setProgramEnrollmentsTableData(data);
  }, [programEnrollments, pickList]);

  const columns = useMemo(
    () => [
      {
        Header: 'Batch',
        accessor: 'batch_name',
      },
      {
        Header: 'Institute',
        accessor: 'institution_name',
      },
      {
        Header: 'Status',
        accessor: 'status_badge',
      },
      {
        Header: 'Registration Date',
        accessor: 'registration_date_formatted',
      },
      {
        Header: 'Fees Status',
        accessor: 'fee_status_badge',
      },
      {
        Header: 'Medha Program Certificate',
        accessor: 'medha_program_certificate',
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
    setProgramEnrollmentUpdateFormData(programEnrollment);
    setUpdateModalShow(true);
  }

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setCreateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let {id, student, medha_program_certificate, program_enrollment_student, registration_date_formatted, batch_name, institution_name, status_badge, fee_status_badge, ...dataToSave} = data;
    dataToSave['registration_date'] = data.registration_date ? moment(data.registration_date).format("YYYY-MM-DD") : null;
    dataToSave['certification_date'] = data.certification_date ? moment(data.certification_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_payment_date'] = data.fee_payment_date ? moment(data.fee_payment_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_refund_date'] = data.fee_refund_date ? moment(data.fee_refund_date).format("YYYY-MM-DD") : null;
    dataToSave['student'] = student.id;

    // NP.start();
    createProgramEnrollment(dataToSave).then(data => {
      setAlert("Program Enrollment created successfully.", "success");
    }).catch(err => {
      console.log("CREATE_PROGRAM_ENROLLMENT_ERR", err);
      setAlert("Unable to create program Enrollment.", "error");
    }).finally(() => {
      // NP.done();
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
    let {id, student, medha_program_certificate, program_enrollment_student, registration_date_formatted, batch_name, institution_name, status_badge, fee_status_badge, ...dataToSave} = data;
    dataToSave['registration_date'] = data.registration_date ? moment(data.registration_date).format("YYYY-MM-DD") : '';
    dataToSave['certification_date'] = data.certification_date ? moment(data.certification_date).format("YYYY-MM-DD") : '';
    dataToSave['fee_payment_date'] = data.fee_payment_date ? moment(data.fee_payment_date).format("YYYY-MM-DD") : '';
    dataToSave['fee_refund_date'] = data.fee_refund_date ? moment(data.fee_refund_date).format("YYYY-MM-DD") : '';

    // NP.start();
    updateProgramEnrollment(Number(id), dataToSave).then(data => {
      setAlert("Program Enrollment updated successfully.", "success");
    }).catch(err => {
      console.log("UPDATE_PROGRAM_ENROLLMENT_ERR", err);
      setAlert("Unable to update program Enrollment.", "error");
    }).finally(() => {
      // NP.done();
      onDataUpdate();
    });
    setUpdateModalShow(false);
  };

  return (
    <div className="container-fluid my-3">
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCreateModalShow(true)}
          >
            + Add More
          </button>
        </div>
      </div>
      <Table columns={columns} data={programEnrollmentsTableData} paginationPageSize={programEnrollmentsTableData.length} totalRecords={programEnrollmentsTableData.length} fetchData={() => {}} loading={false} showPagination={false} onRowClick={handleRowClick} />
      <CreateProgramEnrollmentForm
        show={createModalShow}
        onHide={hideCreateModal}
        student={student}
      />
      <UpdateProgramEnrollmentForm
        show={updateModalShow}
        onHide={hideUpdateModal}
        student={student}
        programEnrollment={programEnrollmentUpdateFormData}
      />
    </div>
  );
};

export default ProgramEnrollments;
