import React, { useState, useEffect } from "react";
import { MeiliSearch } from "meilisearch";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { getDefaultAssignee, getDefaultAssigneeOptions } from "../../../utils/function/lookupOptions";
import {
  getAlumniServicePickList,
  getStudentAlumniServices,
  getStudentsPickList,
} from "../StudentComponents/StudentActions";
import BulkMassEdit from "./BulkMassEdit";
import api from "../../../apis";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import Textarea from "../../../utils/Form/Textarea";
import { Input } from "../../../utils/Form";
import { Form, Formik } from "formik";

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const Section = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #c4c4c4;
  }

  .section-header {
    color: #207b69;
    font-family: "Latto-Regular";
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

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
  .submitbtnclear {
    position: absolute;
    right: 10%;
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

const AlumMassEdit = (props) => {
  const [studentOptions, setStudentOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentInput, setStudentInput] = useState("");
  const [formStatus, setFormStatus] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);

  useEffect((props) => {
    getAlumniServicePickList().then((data) => {
      setTypeOptions(
        data.subcategory.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
          category: item.category,
        }))
      );
      setCategoryOptions(
        data.category.map((item) => ({ value: item.value, label: item.value }))
      );
      setProgramOptions(
        data.program_mode.map((item) => ({
          value: item.value,
          label: item.value,
        }))
      );
    });

    getStudentsPickList().then((data) => {
      setLocationOptions(
        data.alumni_service_location.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });
  }, []);

  const filterStudent = async (filterValue) => {
    const data = await meilisearchClient.index("students").search(filterValue, {
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
      const alumData = await Promise.all(
        students.map(async (obj) => {
          try {
            const data = await getStudentAlumniServices(obj.id);
            console.log("data",data.data.data.alumniServicesConnection.values);
            return data.data.data.alumniServicesConnection.values.map(
              (val) => ({
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
              })
            );
          } catch (err) {
            console.error(err);
            return [];
          }
        })
      );

      setStudents(alumData.flat());
      setFormStatus(true);
    } catch (error) {
      console.error(error);
    }
    // setFormStatus(true)
  };

  const handleChange = (id, newData) => {
    setStudents(
      students.map((obj) => (obj.id === id ? { ...obj, ...newData } : obj))
    );
  };

  const handelSubmit = async () => {
    //   console.log("students",students);

    //   const value = await api
    // .post("/alumni-services/bulk-update", students)
    // .then((data) => {
    //   // Return data
    //   setAlert("Data created successfully.", "success");
    //   setTimeout(() => {
    //     window.location.reload(false);
    //   }, 3000);
    // })
    // .catch((err) => {
    //   setAlert("Unable to create field data.", "error");
    //   setTimeout(() => {
    //     window.location.reload(false);
    //   }, 1000);
    // });

    // try {
    //   const value = await api.post("/alumni-services/bulk-update", students);

    //   setTimeout(async() => {
    //     await window.location.reload(false);
    //     setAlert("Unable to create field data.", "success");
    //       }, 1000);

    //   // Fetch updated data or update state with latest data here
    // } catch (error) {
    //   console.error(error);
    //   setAlert("Unable to create field data.", "error");
    // }
    props.handelSubmit(students, "AlumniBuldEdit");
  };

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });

    getStudentsPickList().then((data) => {
      setLocationOptions(
        data.alumni_service_location.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });
  }, []);
  useEffect(() => {
    console.log(students);
  }, [])
  

  const handelCancel = () => {
    props.handelCancel();
  };
  return (
    <Modal
      centered
      size="lg"
      // style={{ height: '700px' }}
      responsive
      show={true}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
      // dialogClassName="fullscreen-modal"
    >
      { !formStatus && (
        <div className="col-md-6 col-sm-12 px-3" >
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
            <button className="btn btn-primary mt-3" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}

      {formStatus &&
        (students.length > 0 ? (
          
          <>
             <Modal.Header className="bg-white">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <h1 className="text--primary bebas-thick mb-0">
            
            Mass Edit Alumni Engagement
          </h1>
        </Modal.Title>
      </Modal.Header>
            <Formik
            // onSubmit={onSubmit}
            // initialValues={initialValues}
            // validationSchema={validationRules}
          >
            {/* {({ values }) => ( */}
              <Form>
                <>
                  <div className="row px-3">
                    <div className="col-md-6 col-sm-12 mt-2">
                     
                      <label className="leading-24">Student</label>
                      <Select
                        //   defaultValue={[colourOptions[2], colourOptions[3]]}
                        isMulti
                        isDisabled={true}
                        name="student_ids"
                        options={studentOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        // onInputChange={(e) => setStudentInput(e)}
                        // onChange={(choice) => setStudents(choice)}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                    {/* {assigneeOptions.length ? ( */}
                    <Input
                      control="lookupAsync"
                      name="assigned_to"
                      label="Assigned To"
                      required
                      className="form-control"
                      placeholder="Assigned To"
                      // filterData={filterAssignedTo}
                      // defaultOptions={assigneeOptions}
                    />
                  {/* ) : (
                    <Skeleton count={1} height={45} />
                  )} */}
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="category"
                        label="Category"
                        placeholder="Category"
                        control="lookup"
                        icon="down"
                        className="form-control"
                        // options={categoryOptions}
                        // onChange={(e) => setSelectedCategory(e.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      {/* {selectedCategory && ( */}
                        <Input
                          icon="down"
                          control="lookup"
                          name="type"
                          label="Subcategory"
                          // options={typeOptions.filter(
                          //   (option) => option.category === selectedCategory
                          // )}
                          className="form-control"
                          placeholder="Subcategory"
                          required
                        />
                      {/* )} */}
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        control="lookup"
                        icon="down"
                        name="program_mode"
                        label="Program Mode"
                        // options={programOptions}
                        className="form-control"
                        placeholder="Program Mode"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="location"
                        label="Location"
                        // options={locationOptions}
                        className="form-control"
                        placeholder="Location"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="start_date"
                        label="Start Date"
                        placeholder="Start Date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="end_date"
                        label="End Date"
                        placeholder="End Date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        name="fee_submission_date"
                        label="Contribution Submission Date"
                        placeholder="Contribution Submission Date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                        // onInput={(value) => setFeeSubmissionDateValue(value)}
                        // required={feeFieldsRequired}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        min={0}
                        type="number"
                        name="fee_amount"
                        label="Contribution Amount"
                        placeholder="Contribution Amount"
                        control="input"
                        className="form-control"
                        autoComplete="off"
                        // onInput={(e) => setFeeAmountValue(e.target.value)}
                        // required={feeFieldsRequired}
                      />
                    </div>
                    {/* <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="receipt_number"
                      label="Receipt Number"
                      placeholder="Receipt Number"
                      control="input"
                      className="form-control"
                      autoComplete="off"
                      onInput={(e) => setReceiptNumberValue(e.target.value)}
                      required={feeFieldsRequired}
                    />
                  </div> */}
                    <div className="col-md-12 col-sm-12 mt-2">
                      <Textarea
                        name="comments"
                        label="Comments"
                        placeholder="Comments"
                        control="input"
                        className="form-control"
                        autoComplete="off"
                      ></Textarea>
                    </div>
                  </div>
                </>
                
              </Form>
            {/* )} */}
          </Formik>
            <div className="d-flex">
              <button
                className="btn submitbtnclear btn-danger btn-regular my-5"
                onClick={() => handelCancel()}
              >
                Cancel
              </button>
              <button
                className="btn submitbtn btn-primary btn-regular my-5"
                onClick={() => handelSubmit()}
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <div className="">
            {/* <button
              className="btn submitbtnclear btn-danger btn-regular my-5"
              onClick={() => handelCancel()}
            >
              Jump Back to previous page 
            </button> */}
          </div>
        ))}
    </Modal>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(AlumMassEdit);
