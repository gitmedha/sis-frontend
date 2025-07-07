import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { urlPath } from "../../../constants";

import { getAllSrm } from "../../../utils/function/lookupOptions";
import DetailField from "../../../components/content/DetailField";
import moment from "moment";
import { updateStudentOutreach } from "./operationsActions";
import * as Yup from "yup";

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
const StudentOutreachEdit = (props) => {
  let { onHide, show, refreshTableOnDataSaving } = props;
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const userId = localStorage.getItem("user_id");

  const onSubmit = async (values) => {
    const newObject = { ...values };
    // newObject.start_date = moment(values["start_date"]).format("YYYY-MM-DD");
    newObject.updated_by_frontend = Number(userId);

    // newObject.end_date = moment(values["end_date"]).format("YYYY-MM-DD");
    newObject.students = parseInt(newObject.students, 10);

    newObject.published_at = new Date().toISOString();
    delete values["published_at"];
    const value = await updateStudentOutreach(Number(props.id), newObject);
    refreshTableOnDataSaving();
    setDisableSaveButton(true);
    onHide(value);

    setDisableSaveButton(false);
  };

  let initialValues = {
    category: "",
    department: "",
    gender: "",
    institution_type: "",
    quarter: "",
    month: "",
    state: "",
    students: props.students ? parseInt(props.students, 10) : 0,
    year_fy: "",
  };
  if (props) {
    initialValues["category"] = props.category;
    initialValues["department"] = props.department;
    initialValues["gender"] = props.gender;
    initialValues["institution_type"] = props.institution_type;
    initialValues["quarter"] = props.quarter;
    initialValues["month"] = props.month;
    initialValues["state"] = props.state;
    initialValues["students"] = props.students
      ? parseInt(props.students, 10)
      : 0;
    initialValues["year_fy"] = props?.year_fy;
  }

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];
  const quarterOptions = [
    { value: "Q1", label: "Q1" },
    { value: "Q2", label: "Q2" },
    { value: "Q3", label: "Q3" },
    { value: "Q4", label: "Q4" },
    { value: "Q1-Q4", label: "Q1-Q4" },
  ];

  const monthOptions = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const stateOptions = [
    { value: "Haryana", label: "Haryana" },
    { value: "Bihar", label: "Bihar" },
    { value: "UttarPradesh", label: "Uttar Pradesh" },
    { value: "Uttarkhand", label: "Uttarakhand" },
  ];

  const studentOutreachValidation = Yup.object().shape({
    category: Yup.string().required("Category is required"),
    department: Yup.string().required("Department is required"),
    gender: Yup.string().required("Gender is required"),
    institution_type: Yup.string().required("Institution Type is required"),
    quarter: Yup.string().required("Quarter is required"),
    month: Yup.string().required("Month is required"),
    state: Yup.string().required("State is required"),
    students: Yup.number()
      .typeError("Students must be a number")
      .positive("Students must be a positive number")
      .integer("Students must be an integer")
      .required("Number of students is required"),
    year_fy: Yup.string().required("Financial Year is required"),
  });
  return (
    <>
      {initialValues && props && (
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
              {props.id && props.logo ? (
                <img
                  src={urlPath(props.logo.url)}
                  className="avatar mr-2"
                  alt="Student Profile"
                />
              ) : (
                <div className="flex-row-centered avatar avatar-default mr-2">
                  <FaSchool size={25} />
                </div>
              )}
              <h1 className="text--primary bebas-thick mb-0">
                {props.category ? props.category : `Edit tot Detail ----`}
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={studentOutreachValidation}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="row form_sec">
                    <Section>
                      <h3 className="section-header">Basic Info</h3>
                      <div className="row">
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            control="input"
                            name="year_fy"
                            label="Financial Year"
                            className="form-control"
                            placeholder="Finacial Year"
                          />
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="quarter"
                            label="Quarter"
                            options={quarterOptions}
                            className="form-control"
                            placeholder="Quarter"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="month"
                            label="Month"
                            options={monthOptions}
                            className="form-control"
                            placeholder="Month"
                          />
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="state"
                            label="State"
                            options={stateOptions}
                            className="form-control"
                            placeholder="State"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            control="input"
                            name="department"
                            label="Department"
                            className="form-control"
                            placeholder="Department"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            control="input"
                            name="institution_type"
                            label="Institution Type"
                            className="form-control"
                            placeholder="Institution Type"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="gender"
                            label="Gender"
                            options={genderOptions}
                            className="form-control"
                            placeholder="Gender"
                          />
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            name="students"
                            label="Students"
                            placeholder="Students"
                            control="input"
                            className="form-control"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </Section>
                    <Section>
                      <h3 className="section-header">Other Information</h3>
                      <div className="row">
                        <div className="col-md-6 col-sm-12">
                          <DetailField
                            Bold={""}
                            label="Created By"
                            value={
                              props.createdby
                                ? props.createdby.username
                                : "not found"
                            }
                          />
                          <DetailField
                            Bold={""}
                            label="Created At"
                            value={moment(props.created_at).format(
                              "DD MMM YYYY, h:mm a"
                            )}
                          />
                        </div>

                        <div className="col-md-6 col-sm-12">
                          <DetailField
                            Bold={""}
                            label="Updated By"
                            value={
                              props.updatedby
                                ? props.updatedby.username
                                : "not found"
                            }
                          />
                          <DetailField
                            Bold={""}
                            label="Updated At"
                            value={
                              props.updated_at
                                ? moment(props.updated_at).format(
                                    "DD MMM YYYY, h:mm a"
                                  )
                                : "not found"
                            }
                          />
                        </div>
                      </div>
                    </Section>
                  </div>

                  <div className="row justify-content-end">
                    <div className="col-auto p-0">
                      <button
                        type="button"
                        onClick={onHide}
                        className="btn btn-secondary btn-regular collapse_form_buttons"
                      >
                        CANCEL
                      </button>
                    </div>
                    <div className="col-auto p-0">
                      <button
                        type="submit"
                        className="btn btn-primary btn-regular collapse_form_buttons"
                        disabled={disableSaveButton}
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
      )}
    </>
  );
};

export default StudentOutreachEdit;
