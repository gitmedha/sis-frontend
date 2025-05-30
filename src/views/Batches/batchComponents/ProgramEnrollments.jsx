import styled from "styled-components";
import moment from 'moment';
import { useState, useMemo, useEffect, useCallback } from "react";
import Table from "../../../components/content/Table";
import { FaDownload } from "react-icons/fa";
import CreateProgramEnrollmentForm from "./ProgramEnrollmentForm";
import UpdateProgramEnrollmentForm from "./ProgramEnrollmentForm";
import { createProgramEnrollment, deleteProgramEnrollment, updateProgramEnrollment } from "../../ProgramEnrollments/programEnrollmentActions";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { Badge } from "../../../components/content/Utils";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import ProgramEnrollment from "./ProgramEnrollment";
import SweetAlert from "react-bootstrap-sweetalert";
import { urlPath } from "../../../constants";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import NP from "nprogress";
import nProgress from "nprogress";
import api from "../../../apis";
import {GET_BATCH_PROGRAM_ENROLLMENTS } from "../../../graphql";
import { ProgressBarField } from "../../../components/content/Utils";
import { deleteFile } from "../../../common/commonActions";


const ProgramEnrollments = (props) => {
  let { id, batch, students } = props;
  const [createModalShow, setCreateModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [pickList, setPickList] = useState([]);
  const {setAlert} = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [programEnrollmentAggregate, setProgramEnrollmentAggregate] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [programEnrollmentTableData, setProgramEnrollmentsTableData] = useState([]);
  const [programEnrollments, setProgramEnrollments] = useState([]);
  const [selectedProgramEnrollment, setSelectedProgramEnrollment] = useState({});

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  const getBatchProgramEnrollments = async (limit=paginationPageSize, offset=0, sortBy='created_at', sortOrder = 'asc') => {
    nProgress.start();
    setLoading(true);
    await api.post("/graphql", {
      query: GET_BATCH_PROGRAM_ENROLLMENTS,
      variables: {
        id:  Number(id),
        limit:limit,
        start: offset,
        sort: `${sortBy}:${sortOrder}`,
      },
    })
    .then(data => {
      setProgramEnrollments(data.data.data.programEnrollmentsConnection.values);
      setProgramEnrollmentAggregate(data?.data?.data?.programEnrollmentsConnection?.aggregate);
    })
    .catch(err => {
    })
    .finally(() => {
      setLoading(false);
      nProgress.done();
    });
  };

  const fetchData = useCallback(async (pageIndex, pageSize, sortBy) => {
    if (sortBy.length) {
      let sortByField = 'student.full_name';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'student.full_name':
          case 'institution.name':
          sortByField = sortBy[0].id;
          break;

        default:
          sortByField = 'updated_at';
          break;
      }
      await getBatchProgramEnrollments(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      await getBatchProgramEnrollments(pageSize, pageSize * pageIndex);
    }
  }, []);

  useEffect(async () => {
    await getBatchProgramEnrollments();
  }, [students]);

  programEnrollments.forEach(function(program) {
    program.attendance = students.find(students_id => students_id.id === program.id)?.attendancePercent;
  });

  useEffect(() => {
    let data = programEnrollments.map(programEnrollment => {
      return {
        ...programEnrollment,
        student_name: programEnrollment.student?.full_name,
        student_id : programEnrollment.student?.student_id,
        registration_date_formatted: moment(programEnrollment.registration_date).format("DD MMM YYYY"),
        certification_date_formatted: programEnrollment.certification_date ? moment(programEnrollment.certification_date).format("DD MMM YYYY"):'',
        batch_name: programEnrollment.batch?.name,
        institution_name: programEnrollment.institution?.name,
        status_badge: <Badge value={programEnrollment.status} pickList={pickList.status} />,
        fee_status_badge: <Badge value={programEnrollment.fee_status} pickList={pickList.fee_status} />,
        medha_program_certificate_icon: programEnrollment.medha_program_certificate ? <a href={urlPath(programEnrollment.medha_program_certificate.url)} target="_blank" className="c-pointer"><FaDownload size="20" color="#31B89D" /></a> : '',
        program_name: programEnrollment.batch?.program?.name,
        attendanceValue: programEnrollment.attendance,
        attendance: programEnrollment.attendance==0 ? '0%' : <ProgressBarField value={Number.parseInt(programEnrollment.attendance)} />,
        updated_at: moment(programEnrollment.updated_at).format("DD MMM YYYY"),
      };
    });
    setProgramEnrollmentsTableData(data);
  }, [programEnrollments, pickList]);

  const columns = useMemo(
    () => [
      {
        Header: 'Student',
        accessor: 'student.full_name',
      },
      {
        Header: 'Student ID',
        accessor: 'student_id',
      },
      {
        Header: 'Program',
        accessor: 'program_name',
      },
      {
        Header: 'Institution',
        accessor: 'institution.name',
      },
      {
        Header: 'Attendance',
        accessor: 'attendance',
      },
      {
        Header: 'Program Status',
        accessor: 'status_badge',
      },
      {
        Header: 'Registration Date',
        accessor: 'registration_date_formatted',
      },
      {
        Header: 'Certification Date',
        accessor: 'certification_date_formatted',
      },
      {
        Header: 'Updated At',
        accessor: 'updated_at',
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
    setSelectedProgramEnrollment(programEnrollment);
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

  const handleCertificateUpdateAction = async (programEnrollment) => {
    setSelectedProgramEnrollment(programEnrollment);
    await getBatchProgramEnrollments();
  }

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setCreateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let {id, program_name, medha_program_certificate, medha_program_certificate_icon, program_enrollment_batch, registration_date_formatted,student_name, batch_name, institution_name, status_badge, fee_status_badge, ...dataToSave} = data;
    dataToSave['registration_date'] = data.registration_date ? moment(data.registration_date).format("YYYY-MM-DD") : null;
    dataToSave['certification_date'] = data.certification_date ? moment(data.certification_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_payment_date'] = data.fee_payment_date ? moment(data.fee_payment_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_refund_date'] = data.fee_refund_date ? moment(data.fee_refund_date).format("YYYY-MM-DD") : null;
    dataToSave['batch'] = batch.id;

     NP.start();
     createProgramEnrollment(dataToSave).then(data => {
      setAlert("Program Enrollment created successfully.", "success");
    }).catch(err => {
      setAlert("Unable to create program Enrollment.", "error");
    }).finally(async () => {
      NP.done();
      await getBatchProgramEnrollments();
    });
    setCreateModalShow(false);
  };

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setUpdateModalShow(false);
      return;
    }

    // need to remove some data from the payload that's not accepted by the API
    let { id, attendancePercent, attendanceValue, attendance, student_id, program_name, updated_at, created_at, certification_date_formatted, medha_program_certificate, medha_program_certificate_icon, program_enrollment_batch, registration_date_formatted, student_name, batch_name, institution_name,  status_badge, fee_status_badge, higher_education_proof_of_enrollment, assignment_file, ...dataToSave} = data;
    dataToSave['registration_date'] = data.registration_date ? moment(data.registration_date).format("YYYY-MM-DD") : null;
    dataToSave['certification_date'] = data.certification_date ? moment(data.certification_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_payment_date'] = data.fee_payment_date ? moment(data.fee_payment_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_refund_date'] = data.fee_refund_date ? moment(data.fee_refund_date).format("YYYY-MM-DD") : null;

    NP.start();
    updateProgramEnrollment(Number(id), dataToSave).then(data => {
      setAlert("Program Enrollment updated successfully.", "success");
    }).catch(err => {
      setAlert("Unable to update program Enrollment.", "error");
    }).finally(async () => {
      NP.done();
      await getBatchProgramEnrollments();
    });
    setUpdateModalShow(false);
  };

  const handleDelete = async () => {
     NP.start();
    deleteProgramEnrollment(selectedProgramEnrollment.id).then(data => {
      setAlert("Program Enrollment deleted successfully.", "success");
    }).catch(err => {
      setAlert("Unable to delete program enrollment.", "error");
    }).finally(async () => {
      setShowDeleteAlert(false);
      await getBatchProgramEnrollments();
      NP.done();
      history.push("/batches");
    });
  };

  const fileDeleteProofOfEnrollment = async (value) => {
    NP.start();
    deleteFile(selectedProgramEnrollment[value].id).then(data => {
      setAlert("Proof of enrollment deleted successfully.", "success");
    }).catch(err => {
      setAlert("Unable to delete proof of enrollment.", "error");
    }).finally(async () => {
      NP.done();
      setShowDeleteAlert(false);
      await getBatchProgramEnrollments();
      hideViewModal();
    });
  };

  const hideModal = async () => {
    hideViewModal();
    await getBatchProgramEnrollments();
  }

  return (
    <div className="container-fluid my-3">
      <div className="row">
      {((props.batch?.status == 'Enrollment Ongoing'|| props.batch?.status == "In Progress") &&
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCreateModalShow(true)}
          >
            + Add More
          </button>
        </div>
      )}
      </div>
      <Table columns={columns} data={programEnrollmentTableData} onRowClick={handleRowClick} totalRecords={programEnrollmentAggregate.count} fetchData={fetchData} showPagination={programEnrollmentAggregate.count > 10 ? true: false} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize}/>
      <ProgramEnrollment
        show={viewModalShow}
        onHide={hideViewModal}
        handleEdit={handleViewEdit}
        handleDelete={handleViewDelete}
        batch={batch}
        programEnrollment={selectedProgramEnrollment}
        onDelete={fileDeleteProofOfEnrollment}
        onUpdate={hideModal}
        onCertificateUpdate={handleCertificateUpdateAction}
      />
      <CreateProgramEnrollmentForm
        show={createModalShow}
        onHide={hideCreateModal}
        batch={batch}
        allStudents ={programEnrollmentTableData}
      />
      <UpdateProgramEnrollmentForm
        show={updateModalShow}
        onHide={hideUpdateModal}
        batch={batch}
        programEnrollment={selectedProgramEnrollment}
        allStudents={programEnrollmentTableData}
        
      />
      <SweetAlert
          danger
          showCancel
          btnSize="md"
          show={showDeleteAlert}
          onConfirm={() => handleDelete()}
          onCancel={() => setShowDeleteAlert(false)}
          title={
            <span className="text--primary latto-bold">Delete Program Enrollment?</span>
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
          <p>Batch name: {selectedProgramEnrollment.batch && selectedProgramEnrollment.batch?.name}</p>
          <p>Program name: {selectedProgramEnrollment.batch && selectedProgramEnrollment.batch.program?.name}</p>
        </SweetAlert>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(ProgramEnrollments);
