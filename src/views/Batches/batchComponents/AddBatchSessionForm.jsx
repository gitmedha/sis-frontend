import moment from "moment";
import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import api from "../../../apis";

import { MARK_ATTENDANCE } from "../../../graphql";
import { Input } from "../../../utils/Form";
import { sessionValidations } from "../../../validations";
// import { BatchValidations } from "../../../validations";
import { CREATE_SESSION, GET_BATCH_STUDENTS_ONLY } from "../../../graphql";
import Table from '../../../components/content/Table';
import TableWithSelection from '../../../components/content/TableWithSelection';

const Section = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #C4C4C4;
  }

  .section-header {
    color: #207B69;
    font-family: 'Latto-Regular';
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const AddBatchSessionForm = (props) => {
  let { onHide, show, batchId } = props;
  const [students, setStudents] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  let initialValues = {
    name: '',
    name_in_current_sis: '',
    assigned_to: '',
    program: '',
    grant: '',
    institution: '',
    status: '',
    number_of_sessions_planned: '',
    per_student_fees: '',
    seats_available: '',
    start_date: '',
    end_date: '',
  };
  if (props.id) {
    initialValues = {...props}
    initialValues['grant'] = Number(props.grant.id);
    initialValues['program'] = Number(props.program.id);
    initialValues['institution'] = Number(props.institution.id);
    initialValues['assigned_to'] = Number(props.assigned_to.id);
    initialValues['start_date'] = new Date(props.start_date);
    initialValues['end_date'] = new Date(props.end_date);
  }

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      let { data } = await api.post("/graphql", {
        query: CREATE_SESSION,
        variables: {
          batchID: batchId,
          ...values,
          date: moment(values.date).format("YYYY-MM-DD"),
        },
      });
      await markAttendance(Number(data.data.createSession.session.id));
      props.setAlert("Session added successfully.", "success");
    } catch (err) {
      console.log("SESSION_CREATE_ERR", err);
      props.setAlert("Unable to add session.", "error");
    } finally {
      setLoading(false);
      // history.goBack();
    }
  };

  const markAttendance = async (sessionID) => {
    await attendanceRecords.forEach(async (student) => {
      await attendanceApiCaller({
        ...student,
        session: sessionID,
      });
    });
    return;
  };

  const attendanceApiCaller = async (params) => {
    try {
      await api.post("/graphql", {
        variables: params,
        query: MARK_ATTENDANCE,
      });
    } catch (err) {
      console.log("MARK_ATTENDANCE_ERR", err);
    }
  };

  const getStudents = async () => {
    setLoading(true);
    try {
      let { data } = await api.post("/graphql", {
        query: GET_BATCH_STUDENTS_ONLY,
        variables: {
          id: batchId,
        },
      });
      setStudents(clubStudentRecords(data.data.programEnrollments));
    } catch (err) {
      console.log("ERR", err);
    } finally {
      setLoading(false);
    }
  };

  const clubStudentRecords = (records) => {
    return records.map((rec) => ({
      present: false,
      id: rec.student.id,
      program_enrollment_id: Number(rec.id),
      name: `${rec.student.first_name} ${rec.student.last_name}`,
    }));
  };

  useEffect(() => {
    getStudents();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        disableSortBy: true,
      },
      {
        Header: 'Mark Attendance',
        accessor: 'mark_attendance',
        disableSortBy: true,
      },
    ],
    []
  );

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <h1 className="text--primary bebas-thick mb-0">
            Add New Session and Attendance
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          // validationSchema={BatchValidations}
        >
          {({ values }) => (
            <Form>
              <Section>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="date"
                      label="Date"
                      placeholder="Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="topics"
                      control="input"
                      label="Topics Covered"
                      className="form-control"
                      placeholder="Topics Covered"
                    />
                  </div>
                  <div className="col-12 mt-2">
                    <TableWithSelection columns={columns} data={students} paginationPageSize={1} totalRecords={1} fetchData={() => {}} />
                  </div>
                </div>
              </Section>
              <div className="row mt-3 py-3">
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={onHide}
                    className="btn btn-secondary btn-regular mr-2"
                  >
                    CLOSE
                  </button>
                  <div style={{ width: "20px" }} />
                  <button className="btn btn-primary btn-regular" type="submit">
                    SAVE
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddBatchSessionForm;
