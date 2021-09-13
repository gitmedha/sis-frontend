import moment from "moment";
import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import api from "../../../apis";

import { Input } from "../../../utils/Form";
import { sessionValidations } from "../../../validations";
import { GET_BATCH_STUDENTS_ONLY, UPDATE_SESSION_ATTENDANCE } from "../../../graphql";
import TableWithSelection from '../../../components/content/TableWithSelection';
import { getSessionAttendance } from "../batchActions";

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

const BatchSessionForm = (props) => {
  let { onHide, show, batchId } = props;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [sessionAttendance, setSessionAttendance] = useState([]);

  let initialValues = {
    topics: '',
    date: '',
  };
  if (props.session) {
    initialValues['topics'] = props.session.topics_covered;
    initialValues['date'] = new Date(props.session.date);
  }

  const onSubmit = async (values) => {
    let selectedStudentIds = selectedStudents.map(student => student.id);
    onHide({
      ...values,
      sessionAttendance,
      students: students.map(student => {
        return {
          ...student,
          present: selectedStudentIds.includes(student.id),
        };
      }),
    });
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
      phone: rec.student.phone,
    }));
  };

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    // setting the rows that needs to be checked if an existing session is being updated.
    if (props.session && props.session.id) {
      setLoading(true);
      getSessionAttendance(props.session.id).then(async data => {
        setSessionAttendance(data.data.data.attendances); // saving session attendance records
        let selectedStudentProgramEnrollmentIds = data.data.data.attendances.filter(attendance => {
          return attendance.program_enrollment && attendance.present;
        }).map(attendance => {
          return Number(attendance.program_enrollment.id);
        });
        const checkedRows = {};
        students.map((student, index) => {
          if (selectedStudentProgramEnrollmentIds.includes(student.program_enrollment_id)) {
            checkedRows[index] = true;
          }
          return student;
        });
        setSelectedRows(checkedRows);
      }).finally(() => {
        setLoading(false);
      })
    }
  }, [props.session]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        disableSortBy: true,
      },
      {
        Header: 'Phone',
        accessor: 'phone',
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
            {props.session && props.session.id ? 'Update' : 'Add New'} Session and Attendance
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={sessionValidations}
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
                      required
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
                      required
                      className="form-control"
                      placeholder="Topics Covered"
                    />
                  </div>
                  <div className="col-12 mt-5">
                    {loading ? (
                      <>
                        <Skeleton width="100%" height="50px" />
                        <Skeleton width="100%" height="50px" />
                        <Skeleton width="100%" height="50px" />
                      </>
                    ) : (
                      <TableWithSelection columns={columns} data={students} selectAllHeader="Mark Attendance" selectedRows={selectedRows} setSelectedRows={setSelectedStudents} />
                    )}
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

export default BatchSessionForm;
