import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { AlumniServiceValidations } from "../../../validations/Student";
import {
  getStudentsPickList,
  getAlumniServicePickList,
  createBulkAlumniService,
  searchStudents
} from "./StudentActions";
import Textarea from "../../../utils/Form/Textarea";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import { MeiliSearch } from "meilisearch";
import Select from "react-select";
import moment from "moment";

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


const MassEdit = (props) => {
  let { onHide, show } = props;
  const [studentOptions, setStudentOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [feeSubmissionDateValue, setFeeSubmissionDateValue] = useState(
    props.alumniService ? props.alumniService.fee_submission_date : null
  );
  const [feeAmountValue, setFeeAmountValue] = useState(
    props.alumniService ? props.alumniService.fee_amount : ""
  );
  const [receiptNumberValue, setReceiptNumberValue] = useState(
    props.alumniService ? props.alumniService.receipt_number : ""
  );
  const [validationRules, setValidationRules] = useState(
    AlumniServiceValidations
  );
  const [feeFieldsRequired, setFeeFieldsRequired] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (props.alumniService) {
      setSelectedCategory(
        props.alumniService ? props.alumniService.category : ""
      );
    }
  }, [props.alumniService, show]);

  useEffect(() => {
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
  }, []);

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
    filterStudent().then((data) => {
      setStudentOptions(data);
    });
    setStudentOptions(props.data.map(obj=>{
      return {value:obj.id,label:obj.full_name}
    }))
  }, [props]);

  let initialValues = {
    student_ids: [],
    employer_name: "",
    opportunity_name: "",
    status: "",
    start_date: "",
    end_date: "",
    source: "",
    salary_offered: "",
    category:"",
    subcategory:"",
    assigned_to: "",
  };

  //   if (props.alumniService) {
  //     initialValues = {...initialValues, ...props.alumniService};
  //     initialValues['assigned_to'] = props.alumniService?.assigned_to?.id;
  //     initialValues['start_date'] = props.alumniService.start_date ? new Date(props.alumniService.start_date) : null;
  //     initialValues['end_date'] = props.alumniService.end_date ? new Date(props.alumniService.end_date) : null;
  //     initialValues['fee_submission_date'] = props.alumniService.fee_submission_date ? new Date(props.alumniService.fee_submission_date) : null;
  //     initialValues['category'] = props.alumniService.category ? props.alumniService.category : null;
  //   }

  const handleClose = () => {
    setSelectedCategory("");
    onHide([],"Alumn");
  };

  const onSubmit = async (values) => {
    values.students = students;

    let newdata = values.students.map((obj) => {
     let startDate= values.start_date ? moment(values.start_date).format("YYYY-MM-DD") : null;
     let endDate= values.end_date ? moment(values.end_date).format("YYYY-MM-DD") : null;
     let feeSubmission= values.fee_submission_date ? moment(values.fee_submission_date).format("YYYY-MM-DD") : null;
     let feeAmount=values.fee_amount 
    //  let receiptNumber=values.receipt_number ?values.receipt_number:""
     let comments=values.comments ? values.comments :''
      return {
        student: obj.id,
        assigned_to: values.assigned_to,
        category: selectedCategory,
        comments: comments,
        end_date: endDate,
        fee_amount: feeAmount,
        fee_submission_date: feeSubmission,
        location: values.location,
        program_mode: values.program_mode,
        // receipt_number: receiptNumber,
        start_date: startDate,
        type: values.type,
      };
    });
    props.uploadAlumniData(newdata);
  };

  const filterStudent = async (filterValue) => {
    try {

      const {data} = await searchStudents(filterValue);

      let employmentConnectionStudent = props.employmentConnection
          ? props.employmentConnection.student
          : null;
        let studentFoundInEmploymentList = false;
        let filterData = data.studentsConnection.values.map((student) => {
          if (
            props.employmentConnection &&
            student.id === Number(employmentConnectionStudent?.id)
          ) {
            studentFoundInEmploymentList = true;
          }
          return {
            ...student,
            label: `${student.full_name} (${student.student_id})`,
            value: Number(student.id),
          };
        });
        if (
          props.employmentConnection &&
          employmentConnectionStudent !== null &&
          !studentFoundInEmploymentList
        ) {
          filterData.unshift({
            label: employmentConnectionStudent.full_name,
            value: Number(employmentConnectionStudent.id),
          });
        }
        return filterData;

      
    } catch (error) {
      console.error(error);
    }
  };

  const colourOptions = [
    { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
    { value: "blue", label: "Blue", color: "#0052CC", isDisabled: true },
    { value: "purple", label: "Purple", color: "#5243AA" },
    { value: "red", label: "Red", color: "#FF5630", isFixed: true },
    { value: "orange", label: "Orange", color: "#FF8B00" },
    { value: "yellow", label: "Yellow", color: "#FFC400" },
    { value: "green", label: "Green", color: "#36B37E" },
    { value: "forest", label: "Forest", color: "#00875A" },
    { value: "slate", label: "Slate", color: "#253858" },
    { value: "silver", label: "Silver", color: "#666666" },
  ];

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={handleClose}
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
            {props.alumniService && props.alumniService.id
              ? "Update"
              : "Add New"}{" "}
            Alumni Service
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={validationRules}
        >
          {({ values }) => (
            <Form>
              <Section>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                    {/* <Input
                      name="student_ids"
                      control="lookupAsync"
                      label="Student"
                      isMulti={true}
                      className="form-control"
                      placeholder="Student"
                      filterData={filterStudent}
                      defaultOptions={ studentOptions}
                      required={true}
                    /> */}
                    <label className="leading-24">Student</label>
                    <Select
                      //   defaultValue={[colourOptions[2], colourOptions[3]]}
                      isMulti
                      name="student_ids"
                      options={studentOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(choice) => setStudents(choice)}
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
                      filterData={filterAssignedTo}
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
                      onInput={(value) => setFeeSubmissionDateValue(value)}
                      required={feeFieldsRequired}
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
                      onInput={(e) => setFeeAmountValue(e.target.value)}
                      required={feeFieldsRequired}
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
              </Section>
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
                    onClick={handleClose}
                    className="btn btn-secondary btn-regular mr-2"
                  >
                    CANCEL
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

export default MassEdit;
