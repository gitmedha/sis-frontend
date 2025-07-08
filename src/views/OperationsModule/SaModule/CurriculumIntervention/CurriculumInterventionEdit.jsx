import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { Input } from "../../../../utils/Form";
import DetailField from "../../../../components/content/DetailField";
import moment from "moment";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import * as Yup from "yup";
import { updateCurriculumInterventionEntry } from "../actions";

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

const CurriculumInterventionEdit = (props) => {
  const { onHide, show, refreshTableOnDataSaving } = props;
  const [disableSaveButton, setDisableSaveButton] = useState(false);

  // Initialize form values with proper defaults
  let initialValues = {
    module_created_for: "",
    module_developed_revised: "",
    start_date: "",
    end_date: "",
    module_name: "",
    govt_dept_partnered_with: "",
    medha_poc: null,
    isactive: true
  };

  // Populate initial values if props exist
  if (props) {
    console.log("props",props);
    initialValues = {
      module_created_for: props.module_created_for || "",
      module_developed_revised: props.module_developed_revised || "",
      start_date:  new Date(props.start_date) ||  "",
      end_date: new Date(props.end_date) || "",
      module_name: props.module_name || "",
      govt_dept_partnered_with: props.govt_dept_partnered_with || "",
      medha_poc: props.medha_poc?.id || null,
      isactive: props.isactive === true ? "Yes" : "No"
    };
  }

  // Validation schema - only validate fields that are editable
  const validationSchema = Yup.object().shape({
    module_created_for: Yup.string().required("Required"),
    module_developed_revised: Yup.string().required("Required"),
    start_date: Yup.date().required("Required"),
    end_date: Yup.date()
      .required("Required")
      .min(Yup.ref('start_date'), 'End date must be after start date'),
    module_name: Yup.string().required("Required"),
    govt_dept_partnered_with: Yup.string().required("Required"),
    medha_poc: Yup.number().nullable().required("Required"),
    isactive: Yup.boolean()
  });

  const onSubmit = async (values) => {
    setDisableSaveButton(true);
    try {
      const submissionData = {
        ...values,
        start_date: values.start_date ? moment(values.start_date).toISOString() : null,
        end_date: values.end_date ? moment(values.end_date).toISOString() : null,
      };
      
      await updateCurriculumInterventionEntry(Number(props.id), submissionData);
      setAlert("Curriculum Intervention updated successfully", "success");
      if (refreshTableOnDataSaving) refreshTableOnDataSaving();
      onHide();
    } catch (error) {
      setAlert(error.message || "An error occurred while updating", "danger");
    } finally {
      setDisableSaveButton(false);
    }
  };



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
        <Modal.Title id="contained-modal-title-vcenter" className="d-flex align-items-center">
          <h1 className="text--primary bebas-thick mb-0">Edit Curriculum Intervention</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Section>
                <h3 className="section-header">Module Information</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="module_created_for"
                      label="Module Created For"
                      required
                      options={[
                        {id:1,label:"Module 1",value:"Module 1"},
                        {id:2,label:"Module 2",value:"Module 2"},
                        {id:3,label:"Module 3",value:"Module 3"},
                        {id:4,label:"Module 4",value:"Module 4"},
                        {id:5,label:"Module 5",value:"Module 5"},
                        {id:6,label:"Module 6",value:"Module 6"},
                        {id:7,label:"Module 7",value:"Module 7"},
                      ]}
                      className="form-control"
                      placeholder="Select module created for"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="module_developed_revised"
                      label="Module Developed / Revised"
                      required
                      options={
                        [
                          {id:1,label:"Module 1",value:"Module 1"},
                          {id:2,label:"Module 2",value:"Module 2"},
                          {id:3,label:"Module 3",value:"Module 3"},
                          {id:4,label:"Module 4",value:"Module 4"},
                          {id:5,label:"Module 5",value:"Module 5"},
                          {id:6,label:"Module 6",value:"Module 6"},
                          {id:7,label:"Module 7",value:"Module 7"},
                        ]
                      }
                      className="form-control"
                      placeholder="Select module developed/revised"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="start_date"
                      label="Start Date"
                      required
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="end_date"
                      label="End Date"
                      required
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-12 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="module_name"
                      label="Name of the Module"
                      required
                      className="form-control"
                      placeholder="Enter module name"
                    />
                  </div>
                </div>
              </Section>
              
              <Section>
                <h3 className="section-header">Partner & Assignment</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="govt_dept_partnered_with"
                      label="Govt. Department Partnered With"
                      required
                      options={
                        [
                          {id:1,label:"Module 1",value:"Module 1"},
                          {id:2,label:"Module 2",value:"Module 2"},
                          {id:3,label:"Module 3",value:"Module 3"},
                        ]
                      }
                      className="form-control"
                      placeholder="Select government department"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="medha_poc"
                      label="Medha POC"
                      required
                      options={
                        [
                          {id:1,label:"Module 1",value:"Module 1"},
                          {id:2,label:"Module 2",value:"Module 2"},
                          {id:3,label:"Module 3",value:"Module 3"},
                        ]
                      }
                      className="form-control"
                      placeholder="Select Medha POC"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="checkbox"
                      name="isactive"
                      label="Is Active"
                      className="form-check-input"
                      options={[
                        {id:1,label:"Yes",value:"Yes"},
                        {id:2,label:"No",value:"No"},
                      ]}
                    />
                  </div>
                </div>
              </Section>

              <div className="d-flex justify-content-end mt-4">
                <button 
                  type="button" 
                  onClick={onHide} 
                  className="btn btn-danger btn-regular mr-2"
                >
                  CLOSE
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-regular mx-0" 
                  disabled={disableSaveButton}
                >
                  SAVE
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CurriculumInterventionEdit;