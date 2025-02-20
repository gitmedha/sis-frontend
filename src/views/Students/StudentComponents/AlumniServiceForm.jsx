import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { AlumniServiceValidations } from "../../../validations/Student";
import {
  getStudentsPickList,
  getAlumniServicePickList,
} from "./StudentActions";
import Textarea from "../../../utils/Form/Textarea";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import * as Yup from "yup";
import { compareObjects, createLatestAcivity, findDifferences, findServiceStudentDifferences } from "src/utils/LatestChange/Api";

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

const statusOption = [
  { value: "Paid", label: "Paid" },
  { value: "Unpaid", label: "Unpaid" },
];

const AlumniServiceForm = (props) => {
  let { onHide, show } = props;
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
  const [commentRequired,setCommentRequired]=useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [status, setStatus] = useState("");
  const [role,setRole]=useState([]);
  const userId = Number(localStorage.getItem("user_id"))

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
      setRole(data.role);
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
    let fee_submission_date = Yup.string()
      .nullable()
      .required("Contribution submission date is required.");
    let comments=Yup.string().nullable().required("Comment is required.");
    let fee_amount = Yup.string()
      .nullable()
      .required("Contribution amount is required.");
    let receipt_number = Yup.string()
      .nullable()
      .required("Receipt number is required.");
    let fieldsRequired = status === "Paid";

    if (!fieldsRequired && props.alumniService) {
      if (Object.keys(props.alumniService).length) {
        fieldsRequired =
          props.alumniService.status === "Paid" && status !== "Unpaid";
      }
    }
    setFeeFieldsRequired(fieldsRequired);
    if (fieldsRequired ) {
      setValidationRules(
        AlumniServiceValidations.shape({
          fee_submission_date,
          fee_amount,
          receipt_number,
          comments
        })
      );
      
    }
    if (commentRequired ) {
      setValidationRules(
        AlumniServiceValidations.shape({
          comments
        })
      ); 
    }
    else {
      setValidationRules(
        AlumniServiceValidations.omit([
          "fee_submission_date",
          "fee_amount",
          "receipt_number",
          "comments"
        ])
      );
    }
  }, [status, props.alumniService,commentRequired]);

  useEffect(() => {
    setFeeSubmissionDateValue(
      props.alumniService ? props.alumniService.fee_submission_date : null
    );
    setFeeAmountValue(
      props.alumniService ? props.alumniService.fee_amount : ""
    );
    setReceiptNumberValue(
      props.alumniService ? props.alumniService.receipt_number : ""
    );
  }, [props]);

  let initialValues = {
    alumni_service_student: props.student.full_name,
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
    role:""
  };

  if (props.alumniService) {
    initialValues = { ...initialValues, ...props.alumniService };
    initialValues["assigned_to"] = props.alumniService?.assigned_to?.id;
    initialValues["start_date"] = props.alumniService.start_date
      ? new Date(props.alumniService.start_date)
      : null;
    initialValues["end_date"] = props.alumniService.end_date
      ? new Date(props.alumniService.end_date)
      : null;
    initialValues["fee_submission_date"] = props.alumniService
      .fee_submission_date
      ? new Date(props.alumniService.fee_submission_date)
      : null;
    initialValues["category"] = props.alumniService.category
      ? props.alumniService.category
      : null;
      initialValues["role"]=props.alumniService?.role
  }

  const handleClose = () => {
    setSelectedCategory("");
    onHide();
  };

  const onSubmit = async (values) => {
    setSelectedCategory("");


    let propgramEnrollemntData={};
    if(props.alumniService ){
      propgramEnrollemntData={module_name:"Student",activity:"Alumni Service Updated",event_id:values.student.id,updatedby:userId ,changes_in:findServiceStudentDifferences(props.alumniService,values)};
      
    }else {
      propgramEnrollemntData={module_name:"Student",activity:"Alumni Service Created",event_id:props.student.id,updatedby:userId ,changes_in:{name:values.alumni_service_student}};
    }

    await createLatestAcivity(propgramEnrollemntData);
    onHide(values);
  };


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
            Alumni Engagement
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
                <div className="row form_sec">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="alumni_service_student"
                      control="input"
                      label="Student"
                      className="form-control capitalize"
                      placeholder="Student"
                      disabled={true}
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
                        onChange={(selectedOption) => {
                          const value = selectedOption?.value; 
                          setCommentRequired(value.toLowerCase() === "workshop"); 
                        }}
                        className="form-control"
                        placeholder="Subcategory"
                        required
                      />
                    )}
                  </div>

                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="role"
                      label="Role"
                      placeholder="Role"
                      control="lookup"
                      icon="down"
                      className="form-control"
                      options={role}
                      // onChange={(e) => setSelectedCategory(e.value)}
                      required
                    />
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
                      name="status"
                      label="Status"
                      placeholder="Status"
                      control="lookup"
                      className="form-control"
                      autoComplete="off"
                      icon="down"
                      options={statusOption}
                      required={feeFieldsRequired}
                      onChange={(e) => setStatus(e.value)}
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
                  <div className="col-md-6 col-sm-12 mt-2">
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
                  </div>

                  <div className="col-md-12 col-sm-12 mt-2">
                    <Textarea
                      name="comments"
                      label="Comments"
                      placeholder="Comments"
                      control="input"
                      required={commentRequired}
                      // onInput={(e)=>setCommentRequired(true)}
                      className="form-control"
                      autoComplete="off"
                    ></Textarea>
                  </div>
                </div>
              </Section>

              <div className="row justify-content-end mt-5">
                <div className="col-auto p-0">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-secondary btn-regular collapse_form_buttons"
                  >
                    CANCEL
                  </button>
                </div>
                <div className="col-auto p-0">
                  <button
                    type="submit"
                    className="btn btn-primary btn-regular collapse_form_buttons"
                  >
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

export default AlumniServiceForm;
