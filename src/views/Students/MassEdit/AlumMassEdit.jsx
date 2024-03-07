import React, { useState, useEffect } from "react";
import { MeiliSearch } from "meilisearch";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { getDefaultAssignee } from "../../../utils/function/lookupOptions";
import { getAlumniServicePickList, getStudentAlumniServices, getStudentsPickList } from "../StudentComponents/StudentActions";
import BulkMassEdit from "./BulkMassEdit";
import api from "../../../apis";

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const Section1 = styled.table`
  .create_data_table {
    border-collapse: collapse;
    width: 100%;
    overflow: auto;
  }

  th,
  td {
    padding: 8px;
    text-align: left;
    border: 1px solid #bebfc0;
  }

  th {
    background-color: #257b69;
    color: #fff;
  }

  .table-input,
  .table-input-select {
    width: 8rem;
    padding: 2px;
    margin: 0;
    background-color: initial;
    border-radius: 5px;
    border: 1px solid #bebfc0;
  }

  tr {
    border: 1px solid #000;
  }

  .submitbtn {
    position: absolute;
    right: 0;
  }
  .table-input-select-wrapper {
  width: 8rem;
  padding: 2px;
  margin: 0;
  background-color: initial;
  border-radius: 5px;
  border: 1px solid #bebfc0;
}

.select__control {
  border: none; /* Remove the border from the control */
}

.select__control:hover {
  border: none; /* Remove the border on hover */
}

.select__menu {
  border: 1px solid #bebfc0; /* Add border to the dropdown menu */
}

.select__menu-list {
  border: none; /* Remove border from menu items */
}
`;

const AlumMassEdit = () => {
  const [studentOptions, setStudentOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentInput, setStudentInput] = useState("");
  const [formStatus, setFormStatus] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  useEffect(() => {
    getAlumniServicePickList().then((data) => {
      setTypeOptions(data.subcategory.map((item) => ({ key: item.value, value: item.value, label: item.value, category: item.category })));
      setCategoryOptions(data.category.map((item) => ({ value: item.value, label: item.value })));
      setProgramOptions(data.program_mode.map((item) => ({ value: item.value, label: item.value })));
    });

    getStudentsPickList().then((data) => {
      setLocationOptions(data.alumni_service_location.map((item) => ({ key: item.value, value: item.value, label: item.value })));
    });
  }, []);

  const filterStudent = async (filterValue) => {
    const data = await meilisearchClient
      .index("students")
      .search(filterValue, {
        limit: 100,
        attributesToRetrieve: ["id", "full_name", "student_id"],
      });

    return data.hits.map((student) => ({
      ...student,
      label: `${student.full_name} (${student.student_id})`,
      value: Number(student.id),
    }));
  };

  useEffect(() => {
    filterStudent(studentInput).then((data) => {
      setStudentOptions(data);
    });
  }, [studentInput]);

  const handleSubmit = async () => {
    try {
      const alumData = await Promise.all(students.map(async (obj) => {
        try {
          const data = await getStudentAlumniServices(obj.id);
          return data.data.data.alumniServicesConnection.values.map((val) => ({
            assigned_to: val.assigned_to.id,
            category: val.category,
            comments: val.comments,
            end_date: val.end_date,
            fee_amount: val.fee_amount,
            fee_submission_date: val.fee_submission_date,
            location: val.location,
            program_mode: val.program_mode,
            receipt_number: val.receipt_number,
            start_date: val.start_date,
            type: val.type,
            student_id: obj.id,
            id: Number(val.id),
          }));
        } catch (err) {
          console.error(err);
          return [];
        }
      }));

      setStudents(alumData.flat());
      setFormStatus(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (id, newData) => {
    setStudents(students.map(obj => (obj.id === id ? { ...obj, ...newData } : obj)));
  };

  const handelSubmit=async()=>{
    console.log("students",students);

    const value = await api
        .post("/alumni-services/bulk-update", students)
        .then((data) => {
          // setAlert("data created successfully.", "success");
          console.log("yes");
          // history.push(`/student/${data.data.data.createStudent.student.id}`);
        })
        .catch((err) => {
          console.log("Unable to create field data .", "error");
        });
  }

  return (
    <Modal
      centered
      size="xl"
      responsive
      show={true}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
      dialogClassName="fullscreen-modal"
    >
      {!formStatus && (
        <div className="col-md-6 col-sm-12 mt-2" style={{ marginLeft: "2rem" }}>
          <div>
            <label className="leading-24">Student</label>
            <Select
              isMulti
              name="student_ids"
              options={studentOptions}
              filterData={filterStudent}
              onInputChange={(e) => setStudentInput(e)}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(choices) => setStudents(choices)}
            />
          </div>
          <div>
            <button className="btn btn-primary mt-3" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}

      {formStatus && (
        <Section1>
          <table className="create_data_table mt-5">
            <thead className="border mt-5">
              <tr>
                <th className="border">Assigned To</th>
                <th className="border">Category </th>
                <th className="border">Sub Category </th>
                <th className="border">Start Date </th>
                <th className="border">End Date </th>
                <th className="border">Fee Amount</th>
                <th className="border">Fee Submission Date</th>
                <th className="border">Location </th>
                <th className="border">Program Mode </th>
                <th className="border">Receipt Number </th>
              </tr>
            </thead>
            <tbody className="mb-4">
              {students.map((student, id) => (
                <tr key={id} className="mt-4">
                  <BulkMassEdit
                    categoryOptions={categoryOptions}
                    programOptions={programOptions}
                    typeOptions={typeOptions}
                    locationOptions={locationOptions}
                    dataPoints={student}
                    handelChange={handleChange}
                  />
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex">
            <button className="btn submitbtn btn-primary btn-regular my-5" onClick={()=>handelSubmit()}>Submit</button>
          </div>
        </Section1>
      )}
    </Modal>
  );
};

export default AlumMassEdit;
