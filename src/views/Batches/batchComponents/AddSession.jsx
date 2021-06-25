import moment from "moment";
import api from "../../../apis";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input, Form } from "../../../utils/Form";
import SessionStudentList from "./SessionStudentList";
import { sessionValidations } from "../../../validations";
import { CREATE_SESSION, GET_BATCH_STUDENTS_ONLY } from "../../../graphql";
import SkeletonLoader from "../../../components/content/SkeletonLoader";

const AddSession = (props) => {
  const [students, setStudents] = useState([]);
  const [isSessionCreated, setSessionCreated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const batchID = Number(props.match.params.batchId);

  const initialValues = {
    date: "",
    topics: "",
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      let { data } = await api.post("/graphql", {
        query: CREATE_SESSION,
        variables: {
          batchID,
          ...values,
          date: moment(values.date).format("YYYY-MM-DD"),
        },
      });
      console.log("RES", data);
      setSessionCreated(true);
      await getStudents();
    } catch (err) {
      console.log("SESSION_CREATE_ERR", err);
    } finally {
      setLoading(false);
    }
  };

  const getStudents = async () => {
    try {
      let { data } = await api.post("/graphql", {
        query: GET_BATCH_STUDENTS_ONLY,
        variables: {
          id: batchID,
        },
      });
      setStudents(clubStudentRecords(data.data.programEnrollments));
    } catch (err) {
      console.log("ERR", err);
    }
  };

  const clubStudentRecords = (records) => {
    return records.map((rec) => ({
      id: rec.student.id,
      name: `${rec.student.first_name} ${rec.student.last_name}`,
    }));
  };

  return (
    <div className="container py-3">
      {isLoading && <SkeletonLoader />}
      {!isSessionCreated && !isLoading && (
        <>
          <div className="row">
            <div className="col-md-12 px-4 mb-3">
              <h3 className="latto-bold text--primary">
                Add New Session and Attendance
              </h3>
            </div>
          </div>
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={sessionValidations}
          >
            <div className="row px-2 py-2">
              <div className="col-md-6 col-sm-12 mt-3">
                <Input
                  name="date"
                  label="Date"
                  placeholder="Date"
                  control="datepicker"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-3">
                <Input
                  name="topics"
                  control="input"
                  label="Topics Covered"
                  className="form-control"
                  placeholder="Topics Covered"
                />
              </div>
              <div className="col-md-12 px-0 d-flex mt-3">
                <button type="submit" className="btn btn-primary btn-regular">
                  Save
                </button>
                <div style={{ width: "10px" }} />
                <Link
                  className="btn btn-primary btn-regular"
                  to={`/batch/${props.match.params.batchId}`}
                >
                  Cancel
                </Link>
              </div>
              <div className="col-12 px-2 pt-3">
                <hr />
              </div>
            </div>
          </Form>
        </>
      )}
      {isSessionCreated && !isLoading && (
        <SessionStudentList students={students} loading={isLoading} />
      )}
    </div>
  );
};

export default AddSession;
