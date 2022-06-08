import styled from "styled-components";
import moment from 'moment';
import { useState, useMemo, useEffect, useCallback } from "react";
import Table from "../../../components/content/Table";
import CreateAlumniServiceForm from "./AlumniServiceForm";
import UpdateAlumniServiceForm from "./AlumniServiceForm";
import { createProgramEnrollment, deleteProgramEnrollment, updateProgramEnrollment, getStudentAlumniServices, createAlumniService } from "./StudentActions";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { Badge } from "../../../components/content/Utils";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import SweetAlert from "react-bootstrap-sweetalert";
import { urlPath } from "../../../constants";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import NP from "nprogress";
import nProgress from "nprogress";
import { deleteFile } from "../../../common/commonActions";
import AlumniService from "./AlumniService";

const AlumniServices = (props) => {
  let { id, student, onDataUpdate } = props;
  const [loading, setLoading] = useState(false);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [pickList, setPickList] = useState([]);
  const {setAlert} = props;
  const history = useHistory();
  const [alumniServicesAggregate, setAlumniServicesAggregate] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [alumniServicesTableData, setAlumniServicesTableData] = useState([]);
  const [alumniServices, setAlumniServices] = useState([]);
  const [selectedAlumniService, setSelectedAlumniService] = useState({});

  useEffect(() => {
    // getProgramEnrollmentsPickList().then(data => {
    //   setPickList(data);
    // });
  }, []);

  const fetchStudentAlumniServices = async (limit=paginationPageSize, offset=0, sortBy='updated_at', sortOrder = 'asc') => {
    nProgress.start();
    setLoading(true);
    await getStudentAlumniServices(Number(id), limit, offset, sortBy='created_at', sortOrder = 'desc')
    .then(data => {
      setAlumniServices(data.data.data.alumniServicesConnection.values);
      setAlumniServicesAggregate(data?.data?.data?.alumniServicesConnection?.aggregate);
    })
    .catch(err => {
      console.log("Error in fetching alumni services: ", err);
    })
    .finally(() => {
      setLoading(false);
      nProgress.done();
    });
  };

  const fetchData = useCallback((pageIndex, pageSize, sortBy) => {
    if (sortBy.length) {
      let sortByField = 'certification_date_formatted';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'institution.name':
          sortByField = sortBy[0].id;
          break;

          case ' institution.name':
          sortByField = 'registration_date_formatted';
          break;

        default:
          sortByField = 'updated_at';
          break;
      }
      fetchStudentAlumniServices(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      fetchStudentAlumniServices(pageSize, pageSize * pageIndex);
    }
  }, []);

  useEffect(() => {
    let data = alumniServices.map(alumniService => {
      return {
        ...alumniService,
        start_date_formatted: alumniService.start_date ? moment(alumniService.start_date).format('DD MMM YYYY') : '',
        end_date_formatted: alumniService.end_date ? moment(alumniService.end_date).format('DD MMM YYYY') : '',
        fee_submission_date_formatted: alumniService.fee_submission_date ? moment(alumniService.fee_submission_date).format('DD MMM YYYY') : '',
        updated_at: moment(alumniService.updated_at).format("DD MMM YYYY"),
      };
    });
    setAlumniServicesTableData(data);
  }, [alumniServices]);

  const columns = useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Start Date',
        accessor: 'start_date_formatted',
      },
      {
        Header: 'End Date',
        accessor: 'end_date_formatted',
      },
      {
        Header: 'Fee Submission Date',
        accessor: 'fee_submission_date_formatted',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Assigned To',
        accessor: 'assigned_to.username',
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

  const handleRowClick = alumniService => {
    setSelectedAlumniService(alumniService);
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
    let {id, alumni_service_student, start_date_formatted, end_date_formatted, fee_submission_date_formatted, status_badge, ...dataToSave} = data;
    dataToSave['start_date'] = data.start_date ? moment(data.start_date).format("YYYY-MM-DD") : null;
    dataToSave['end_date'] = data.end_date ? moment(data.end_date).format("YYYY-MM-DD") : null;
    dataToSave['fee_submission_date'] = data.fee_submission_date ? moment(data.fee_submission_date).format("YYYY-MM-DD") : null;
    dataToSave["fee_amount"] = data.fee_amount ? Number(data.fee_amount) : null;
    dataToSave['student'] = student.id;
    console.log('dataToSave', dataToSave);

     NP.start();
     createAlumniService(dataToSave).then(data => {
      setAlert("Alumni Service created successfully.", "success");
    }).catch(err => {
      console.log("Unable to create alumni service: ", err);
      setAlert("Unable to create Alumni Service.", "error");
    }).finally(() => {
      NP.done();
      fetchStudentAlumniServices();
    });
    setCreateModalShow(false);
  };

  const hideUpdateModal = async (data) => {
    // if (!data || data.isTrusted) {
    //   setUpdateModalShow(false);
    //   return;
    // }

    // // need to remove some data from the payload that's not accepted by the API
    // let {id, certification_date_formatted, created_at, updated_at, program_name, medha_program_certificate, medha_program_certificate_icon, program_enrollment_student, registration_date_formatted, batch_name, institution_name, status_badge, fee_status_badge, higher_education_proof_of_enrollment, assignment_file, ...dataToSave} = data;
    // dataToSave['registration_date'] = data.registration_date ? moment(data.registration_date).format("YYYY-MM-DD") : null;
    // dataToSave['certification_date'] = data.certification_date ? moment(data.certification_date).format("YYYY-MM-DD") : null;
    // dataToSave['fee_payment_date'] = data.fee_payment_date ? moment(data.fee_payment_date).format("YYYY-MM-DD") : null;
    // dataToSave['fee_refund_date'] = data.fee_refund_date ? moment(data.fee_refund_date).format("YYYY-MM-DD") : null;

    //  NP.start();
    // updateProgramEnrollment(Number(id), dataToSave).then(data => {
    //   setAlert("Program Enrollment updated successfully.", "success");
    // }).catch(err => {
    //   console.log("UPDATE_PROGRAM_ENROLLMENT_ERR", err);
    //   setAlert("Unable to update program Enrollment.", "error");
    // }).finally(() => {
    //    NP.done();
    //    fetchStudentAlumniServices();
    // });
    // setUpdateModalShow(false);
  };

  const handleDelete = async () => {
    // NP.start();
    // deleteProgramEnrollment(selectedAlumniService.id).then(data => {
    //   setAlert("Program Enrollment deleted successfully.", "success");
    // }).catch(err => {
    //   console.log("STUDENT_DELETE_ERR", err);
    //   setAlert("Unable to delete program enrollment.", "error");
    // }).finally(() => {
    //   setShowDeleteAlert(false);
    //   fetchStudentAlumniServices();
    //    NP.done();
    //    history.push("/students");
    // });
  };

  const fileDeleteProofOfEnrollment = async (value) => {
    NP.start();
    deleteFile(selectedAlumniService[value].id).then(data => {
      setAlert("Proof of enrollment deleted successfully.", "success");
    }).catch(err => {
      console.log("FILE_DELETE_ERR", err);
      setAlert("Unable to delete proof of enrollment.", "error");
    }).finally(() => {
      NP.done();
      setShowDeleteAlert(false);
      fetchStudentAlumniServices();
      hideViewModal();
    });
  };

  const hideModal = () => {
    hideViewModal();
    fetchStudentAlumniServices();
  }

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
      <Table columns={columns} data={alumniServicesTableData} onRowClick={handleRowClick} totalRecords={alumniServicesAggregate.count} fetchData={fetchData} showPagination={alumniServicesAggregate.count > 10 ? true: false} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize}/>
      <AlumniService
        show={viewModalShow}
        onHide={hideViewModal}
        handleEdit={handleViewEdit}
        handleDelete={handleViewDelete}
        student={student}
        alumniService={selectedAlumniService}
        onUpdate={hideModal}
      />
      <CreateAlumniServiceForm
        show={createModalShow}
        onHide={hideCreateModal}
        student={student}
      />
      {/* <UpdateProgramEnrollmentForm
        show={updateModalShow}
        onHide={hideUpdateModal}
        student={student}
        programEnrollment={selectedAlumniService}
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
          <p>Batch name: {selectedAlumniService.batch && selectedAlumniService.batch.name}</p>
          <p>Program name: {selectedAlumniService.batch && selectedAlumniService.batch.program.name}</p>
        </SweetAlert> */}
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(AlumniServices);
