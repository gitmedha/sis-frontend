import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { Input } from "../../../../utils/Form";
import DetailField from "../../../../components/content/DetailField";
import moment from "moment";
import { updateEcosystemEntry } from "../actions";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import * as Yup from "yup";
import { getAllSrm } from "../../../../utils/function/lookupOptions";
import { numberChecker } from "../../../../utils/function/OpsModulechecker";
import Select from "react-select";
import {getAllMedhaUsers} from "../../../../utils/function/lookupOptions";


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

const FormControlStyles = styled.div`
  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: inline-block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .form-control, .select__control {
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    min-height: 38px;
    height: 38px;
    
    &:focus {
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }

  .error-border {
    border-color: #dc3545 !important;
  }

  .select__control--is-focused {
    border-color: #80bdff !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
  }

  .select__menu {
    z-index: 9999;
  }
`;

const customSelectStyles = {
  control: (base) => ({
    ...base,
    minHeight: '38px',
    height: '38px',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '4px',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  singleValue: (base) => ({
    ...base,
    margin: 0,
  }),
};

const EcosystemEdit = (props) => {
  const { onHide, show, refreshTableOnDataSaving } = props;
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [medhaPocOptions, setMedhaPocOptions] = useState([]);
  const [classValue, setClassValue] = useState({});
  const userId = localStorage.getItem("user_id");
  
  const activityTypeOptions = [
    "Industry Talk", "Placement Drive", "Workplace Exposure"
  ].map(type => ({ label: type, value: type }));

  const partnerTypeOptions = [
    "Government", "Private Entity", "NGO", 
    "Academician", "Freelancer", "Researcher"
  ].map(type => ({ label: type, value: type }));

  const govtDeptPartnerWithOptions = [
    "Department of Skill Development and Employment",
    "Directorate of Technical Education",
    "Skill Development of Industrial Training",
    "Department of Higher Education",
    "Department of Technical Education",
    "Department of Secondary Education",
    "DVEDSE",
    "Department of Labor and Resource"
  ].sort((a, b) => a.localeCompare(b))
   .map(type => ({ label: type, value: type }));

  


  const onSubmit = async (values) => {
    setDisableSaveButton(true); // Disable save button immediately
    const formattedValues = { 
      ...values,
      date_of_activity: moment(values.date_of_activity).format("YYYY-MM-DD")
    };

    try {
      const response = await updateEcosystemEntry(Number(props.id), formattedValues);
      // Accept both array and status response for compatibility
      if ((Array.isArray(response) && response.length > 0) || (response && response.status === 200)) {
        setAlert("Ecosystem entry updated successfully", "success");
        if (typeof refreshTableOnDataSaving === "function") {
          await refreshTableOnDataSaving();
        }
        if (typeof onHide === "function") {
          onHide(response);
        }
      } else {
        setAlert("Failed to update ecosystem entry", "danger");
      }
    } catch (error) {
      setAlert("An error occurred while updating", "danger");
    } finally {
      setDisableSaveButton(false);
    }
  };

  let initialValues = {
    activity_type: "",
    date_of_activity: "",
    topic: "",
    govt_dept_partner_with: "",
    type_of_partner: "",
    employer_name_external_party_ngo_partner_with: "",
    attended_students: "",
    male_participants: "",
    female_participants: "",
    medha_poc_1: "",
    medha_poc_2: ""
  };

  if (props) {
    initialValues = {
      activity_type: props.activity_type || "",
      date_of_activity: props.date_of_activity ? new Date(props.date_of_activity) : "",
      topic: props.topic || "",
      govt_dept_partner_with: props.govt_dept_partner_with || "",
      type_of_partner: props.type_of_partner || "",
      employer_name_external_party_ngo_partner_with: 
        props.employer_name_external_party_ngo_partner_with || "",
      attended_students: props.attended_students || "",
      male_participants: props.male_participants || "",
      female_participants: props.female_participants || "",
      medha_poc_1: props.medha_poc_1 || "",
      medha_poc_2: props.medha_poc_2 || ""
    };
  }

  const validationSchema = Yup.object().shape({
    activity_type: Yup.string().required("Activity type is required"),
    date_of_activity: Yup.date().required("Date of activity is required"),
    topic: Yup.string().required("Topic is required"),
    attended_students: Yup.number()
      .required("Number of attended students is required")
      .min(0, "Must be positive number"),
    male_participants: Yup.number()
      .required("Number of male participants is required")
      .min(0, "Must be positive number"),
    female_participants: Yup.number()
      .required("Number of female participants is required")
      .min(0, "Must be positive number"),
    medha_poc_1: Yup.string().required("Medha POC 1 is required")
  });

  const getSelectClass = (field) => {
    return classValue[field] ? "error-border" : "";
  };

  const getSelectedOption = (options, value) => {
    return options.find(option => option.value === value);
  };

  useEffect(() => {
    const fetchMedhaPocs = async () => {
      const data = await getAllMedhaUsers();
      setMedhaPocOptions(data.map(user => ({ label: user.name, value: user.id })));
    };
    fetchMedhaPocs();
  }, []);
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
            Edit Ecosystem Activity
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true} // Ensure Formik updates when props change
        >
          {({ values, setFieldValue }) => (
            <Form>
              <FormControlStyles>
                <Section>
                  <h3 className="section-header">Activity Information</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-3">
                      <div className="form-group">
                        <label>Activity Type *</label>
                        <Select
                          styles={customSelectStyles}
                          className={`${getSelectClass("activity_type")}`}
                          classNamePrefix="select"
                          name="activity_type"
                          options={activityTypeOptions}
                          value={getSelectedOption(activityTypeOptions, values.activity_type)}
                          onChange={(selectedOption) => 
                            setFieldValue("activity_type", selectedOption?.value || "")
                          }
                          isClearable={true}
                          placeholder="Select activity type"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <Input
                        name="date_of_activity"
                        label="Date of Activity *"
                        required
                        placeholder="Select date"
                        control="datepicker"
                        className="form-control"
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-md-12 col-sm-12 mb-3">
                      <Input
                        control="input"
                        name="topic"
                        label="Topic *"
                        required
                        className="form-control"
                        placeholder="Enter topic"
                      />
                    </div>
                  </div>
                </Section>

                <Section>
                  <h3 className="section-header">Partner Information</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12 mb-3">
                      <div className="form-group">
                        <label>Government Department Partner</label>
                        <Select
                          styles={customSelectStyles}
                          className={`${getSelectClass("govt_dept_partner_with")}`}
                          classNamePrefix="select"
                          name="govt_dept_partner_with"
                          options={govtDeptPartnerWithOptions}
                          value={getSelectedOption(govtDeptPartnerWithOptions, values.govt_dept_partner_with)}
                          onChange={(selectedOption) => 
                            setFieldValue("govt_dept_partner_with", selectedOption?.value || "")
                          }
                          isClearable={true}
                          placeholder="Select government department"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 mb-3">
                      <div className="form-group">
                        <label>Type of Partner</label>
                        <Select
                          styles={customSelectStyles}
                          className={`${getSelectClass("type_of_partner")}`}
                          classNamePrefix="select"
                          name="type_of_partner"
                          options={partnerTypeOptions}
                          value={getSelectedOption(partnerTypeOptions, values.type_of_partner)}
                          onChange={(selectedOption) => 
                            setFieldValue("type_of_partner", selectedOption?.value || "")
                          }
                          isClearable={true}
                          placeholder="Select partner type"
                        />
                      </div>
                    </div>
                    <div className="col-md-12 col-sm-12 mb-3">
                      <Input
                        control="input"
                        name="employer_name_external_party_ngo_partner_with"
                        label="Employer/External Party/NGO Partner"
                        className="form-control"
                        placeholder="Enter partner name"
                      />
                    </div>
                  </div>
                </Section>

                <Section>
                  <h3 className="section-header">Participants Information</h3>
                  <div className="row">
                    <div className="col-md-4 col-sm-12 mb-3">
                      <Input
                        control="input"
                        name="attended_students"
                        label="Total Attended Students *"
                        required
                        className="form-control"
                        placeholder="Enter number"
                        onKeyPress={numberChecker}
                      />
                    </div>
                    <div className="col-md-4 col-sm-12 mb-3">
                      <Input
                        control="input"
                        name="male_participants"
                        label="Male Participants *"
                        required
                        className="form-control"
                        placeholder="Enter number"
                        onKeyPress={numberChecker}
                      />
                    </div>
                    <div className="col-md-4 col-sm-12 mb-3">
                      <Input
                        control="input"
                        name="female_participants"
                        label="Female Participants *"
                        required
                        className="form-control"
                        placeholder="Enter number"
                        onKeyPress={numberChecker}
                      />
                    </div>
                  </div>
                </Section>

                <Section>
  <h3 className="section-header">Medha POC</h3>
  <div className="row">
    <div className="col-md-6 col-sm-12 mb-3">
      <div className="form-group">
        <label>Medha POC 1 *</label>
        <Select
          styles={customSelectStyles}
          className={`${getSelectClass("medha_poc_1")}`}
          classNamePrefix="select"
          name="medha_poc_1"
          options={medhaPocOptions}
          value={medhaPocOptions.find(option => 
            option.value === (values.medha_poc_1?.id || values.medha_poc_1)
          )}
          onChange={(selectedOption) => {
            setFieldValue("medha_poc_1", selectedOption?.value || "");
          }}
          isClearable={true}
          placeholder="Select Medha POC 1"
        />
      </div>
    </div>
    <div className="col-md-6 col-sm-12 mb-3">
      <div className="form-group">
        <label>Medha POC 2</label>
        <Select
          styles={customSelectStyles}
          className={`${getSelectClass("medha_poc_2")}`}
          classNamePrefix="select"
          name="medha_poc_2"
          options={medhaPocOptions}
          value={medhaPocOptions.find(option => 
            option.value === (values.medha_poc_2?.id || values.medha_poc_2)
          )}
          onChange={(selectedOption) => {
            setFieldValue("medha_poc_2", selectedOption?.value || "");
          }}
          isClearable={true}
          placeholder="Select Medha POC 2"
        />
      </div>
    </div>
  </div>
</Section>
                <Section>
                  <h3 className="section-header">System Information</h3>
                  <div className="row">
                    <div className="col-md-6 col-sm-12">
                      <DetailField
                        label="Created By"
                        value={props.createdby?.username || "Not available"}
                      />
                      <DetailField
                        label="Created At"
                        value={
                          props.created_at
                            ? moment(props.created_at).format("DD MMM YYYY, h:mm a")
                            : "Not available"
                        }
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <DetailField
                        label="Updated By"
                        value={props.updatedby?.username || "Not available"}
                      />
                      <DetailField
                        label="Updated At"
                        value={
                          props.updated_at
                            ? moment(props.updated_at).format("DD MMM YYYY, h:mm a")
                            : "Not available"
                        }
                      />
                    </div>
                  </div>
                </Section>

                <div className="row justify-content-end mt-4">
                  <div className="col-auto">
                    <button
                      type="button"
                      onClick={onHide}
                      className="btn btn-secondary btn-regular mr-2"
                    >
                      CANCEL
                    </button>
                  </div>
                  <div className="col-auto">
                    <button
                      type="submit"
                      className="btn btn-primary btn-regular"
                      disabled={disableSaveButton}
                      onClick={()=>onSubmit(values)}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </FormControlStyles>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default EcosystemEdit;