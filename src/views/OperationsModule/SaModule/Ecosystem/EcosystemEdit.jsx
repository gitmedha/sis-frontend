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

const activityTypeOptions = [
  { value: "Industry Talk/Expert Talk", label: "Industry Talk/Expert Talk" },
  { value: "Workshop", label: "Workshop" },
  { value: "Seminar", label: "Seminar" },
  { value: "Other", label: "Other" }
];

const partnerTypeOptions = [
  { value: "Government", label: "Government" },
  { value: "NGO", label: "NGO" },
  { value: "Corporate", label: "Corporate" },
  { value: "Educational Institution", label: "Educational Institution" }
];

const EcosystemEdit = (props) => {
  const { onHide, show, refreshTableOnDataSaving } = props;
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [medhaPocOptions, setMedhaPocOptions] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchMedhaPocs = async () => {
      const data = await getAllSrm(1);
      setMedhaPocOptions(data);
    };
    fetchMedhaPocs();
  }, []);

  const onSubmit = async (values) => {
    const formattedValues = { 
      ...values,
      date_of_activity: moment(values.date_of_activity).format("YYYY-MM-DD")
    };

    try {
      const response = await updateEcosystemEntry(Number(props.id), formattedValues);
      if (response.status === 200) {
        setAlert("Ecosystem entry updated successfully", "success");
        refreshTableOnDataSaving();
        onHide(response);
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
    medha_poc_1: Yup.string().required("Primary Medha POC is required")
  });

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
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Section>
                <h3 className="section-header">Activity Information</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="activity_type"
                      label="Activity Type"
                      required
                      options={activityTypeOptions}
                      className="form-control"
                      placeholder="Select activity type"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="date_of_activity"
                      label="Date of Activity"
                      required
                      placeholder="Select date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-12 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="topic"
                      label="Topic"
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
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="govt_dept_partner_with"
                      label="Government Department Partner"
                      className="form-control"
                      placeholder="Enter government department"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="type_of_partner"
                      label="Type of Partner"
                      options={partnerTypeOptions}
                      className="form-control"
                      placeholder="Select partner type"
                    />
                  </div>
                  <div className="col-md-12 col-sm-12 mb-2">
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
                  <div className="col-md-4 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="attended_students"
                      label="Total Attended Students"
                      required
                      className="form-control"
                      placeholder="Enter number"
                      onKeyPress={numberChecker}
                    />
                  </div>
                  <div className="col-md-4 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="male_participants"
                      label="Male Participants"
                      required
                      className="form-control"
                      placeholder="Enter number"
                      onKeyPress={numberChecker}
                    />
                  </div>
                  <div className="col-md-4 col-sm-12 mb-2">
                    <Input
                      control="input"
                      name="female_participants"
                      label="Female Participants"
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
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="medha_poc_1"
                      label="Primary POC"
                      required
                      options={medhaPocOptions}
                      className="form-control"
                      placeholder="Select primary POC"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="medha_poc_2"
                      label="Secondary POC"
                      options={medhaPocOptions}
                      className="form-control"
                      placeholder="Select secondary POC"
                    />
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
  );
};

export default EcosystemEdit;