import React, { useState, useEffect } from "react";
import { MeiliSearch } from "meilisearch";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import {
  getDefaultAssignee,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [defaultAssigne, setDefaultAssignee] = useState({
    value: "",
    label: "",
  });

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
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
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
            console.log("data", data.data.data.alumniServicesConnection.values);
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
  let initialValues = {
    alumni_service_student: "",
    location: "",
    program_mode: "",
    receipt_number: "",
    fee_amount: "",
    comments: "",
    start_date: null,
    end_date: null,
    fee_submission_date: null,
    assigned_to: localStorage.getItem("user_id"),
    category: null,
    type: "",
  };

  const onSubmit = async (values) => {
    console.log(values);
    let data =students.map((obj) => {
      return {
        assigned_to: values.assigned_to ?values.assigned_to: obj.assigned_to,
        category: values.category? values.category :obj.category,
        comments: values.comments ?values.comments:obj.comments,
        end_date: values.end_date ?values.end_date :obj.end_date,
        fee_amount: values.fee_amount? values.fee_amount :obj.fee_amount,
        fee_submission_date: values.fee_submission_date ?values.fee_submission_date :obj.fee_submission_date,
        location: values.location ?values.location :obj.location,
        program_mode: values.program_mode ?values.program_mode :obj.program_mode,
        receipt_number: values.receipt_number ?values.receipt_number :obj.receipt_number,
        start_date: values.start_date ? values.start_date: obj.start_date,
        type: values.type,
        student_id: obj.id,
        id: Number(obj.id),
      };
    });
    console.log("data",data);
    props.handelSubmit(data, "AlumniBuldEdit");
    console.log("yessss.......");
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
  }, []);

  const handelCancel = () => {
    props.handelCancel();
  };
  return (
    <Modal
      centered
      size="lg"
      responsive
      show={true}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
      // dialogClassName="fullscreen-modal"
    >
      {!formStatus && (
        <div className="col-md-6 col-sm-12 px-3">
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
              onSubmit={onSubmit}
              initialValues={initialValues}
              // validationSchema={{}}
            >
              {({ values }) => (
                <Form>
                  <>
                    <div className="row px-3">
                      <div className="col-md-6 col-sm-12 mt-2">
                        <label className="leading-24">Student</label>
                        <Select
                          isMulti
                          isDisabled={true}
                          name="student_ids"
                          options={studentOptions}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          control="lookupAsync"
                          name="assigned_to"
                          label="Assigned To"
                          required
                          className="form-control"
                          placeholder="Assigned To"
                          defaultOptions={assigneeOptions}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          name="category"
                          label="Category"
                          placeholder="Category"
                          control="lookup"
                          icon="down"
                          className="form-control"
                          options={categoryOptions}
                          onChange={(e) => setSelectedCategory(e.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        {selectedCategory && (
                          <Input
                            icon="down"
                            control="lookup"
                            name="type"
                            label="Subcategory"
                            options={typeOptions.filter(
                              (option) => option.category === selectedCategory
                            )}
                            className="form-control"
                            placeholder="Subcategory"
                            required
                          />
                        )}
                      </div>
                      <div className="col-md-6 col-sm-12 mt-2">
                        <Input
                          control="lookup"
                          icon="down"
                          name="program_mode"
                          label="Program Mode"
                          options={programOptions}
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
                          options={locationOptions}
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
                  <div className="row mt-3 py-3">
                    <div className="d-flex justify-content-start">
                      <button
                        className="btn btn-primary btn-regular mx-0"
                        type="submit"
                      >
                        SAVE
                      </button>
                      <button
                        type="button"
                        onClick={handelCancel}
                        className="btn btn-secondary btn-regular mr-2"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
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
