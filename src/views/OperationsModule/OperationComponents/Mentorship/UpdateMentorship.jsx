import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../../utils/Form";
// import { urlPath } from "../../../../constants";
import {
  getAddressOptions,
  getCities,
  getStateDistricts,
} from "../../../Address/addressActions";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../../utils/function/lookupOptions";
import DetailField from "src/components/content/DetailField";
import moment from "moment";
// import { getOpsPickList, updateOpsActivity } from "";
import * as Yup from "yup";
import { numberChecker } from "../../../../utils/function/OpsModulechecker";
import {
  searchBatches,
  searchInstitutions,
  updateMentorshipData,
} from "../operationsActions";
import { updateOpsActivity, getOpsPickList } from "../operationsActions";
import { urlPath } from "src/constants";
import { mentorshipValidations } from "src/validations/OperationsValidation";
import { compareObjects, createLatestAcivity } from "src/utils/LatestChange/Api";

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

const hideBatchName = [
  "New Enrollments -- CAB",
  "New Enrollments -- Lab",
  "New Enrollments -- TAB",
  "New Enrollments -- eCab",
  "New Enrollments -- eTAB",
  "New Enrollments -- CAB Plus Work from Home",
  "New Enrollments -- Svapoorna",
  "New Enrollments -- Swarambh",
  "New Enrollments -- Workshop",
  "New Enrollments -- BMC Design Lab",
  "New Enrollments -- In The Bank",
];

const options = [
  { value: "Offline", label: "Offline" },
  { value: "Online", label: "Online" },
];
const statusOption = [
  { value: "Connected", label: "Connected" },
  { value: "Pipeline", label: "Pipeline" },
  { value: "Dropped out", label: "Dropped out" },
];


const UpdateMentorship = (props) => {
  let { onHide, show, closeopsedit, refreshTableOnDataSaving } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [showSpecifyOthers, setShowSpecifyOthers] = useState(props.mentor_domain === 'Others');
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [districtOption, setDistrictOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [programeName, setProgramName] = useState([]);
  const userId = localStorage.getItem("user_id");
  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    getAddressOptions().then((data) => {
      setStateOptions(
        data?.data?.data?.geographiesConnection?.groupBy.state
          .map((state) => ({
            key: state.id,
            label: state.key,
            value: state.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
      if (props.state) {
        onStateChange({ value: props.state });
      }
    });
     getStateDistricts().then((data) => {
      setDistrictOptions([]);
      setDistrictOptions(
        data?.data?.data?.geographiesConnection?.groupBy?.area
          .map((value) => ({
            key: value.key,
            label: value.key,
            value: value.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );

    });

    getCities().then((data)=>{

      setAreaOptions([]);
      setAreaOptions(
        data
          .map((area) => ({
            key: area.city,
            label: area.city,
            value: area.city,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    })
  }, []);

  const onStateChange = async (value) => {
    await getCities(value).then((data)=>{
      setAreaOptions([]);
      setAreaOptions(
        data
          .map((area) => ({
            key: area.city,
            label: area.city,
            value: area.city,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    })
  };

  const onSubmit = async (values) => {
    try {
      const newData = { ...values };
      newData.onboarding_date = moment(values["onboarding_date"]).format(
        "YYYY-MM-DD"
      );
      newData["updatedby"] = Number(userId);
      let datavaluesforlatestcreate={module_name:"Operation",activity:"Mentorship Data Updated",event_id:"",updatedby:userId ,changes_in:compareObjects(newData,initialValues)};
      await createLatestAcivity(datavaluesforlatestcreate);
      const value = await updateMentorshipData(Number(props.id), newData);
      refreshTableOnDataSaving();
      setDisableSaveButton(true);
      onHide(value);
      closeopsedit();
      setDisableSaveButton(false);
    } catch (err) {
      console.log(err);
    }
  };

  
  let initialValues = {
    assigned_to: "",
    mentor_name: "",
    email: "",
    mentor_domain: "",
    mentor_company_name: "",
    designation: "",
    mentor_area: "",
    mentor_state: "",
    outreach: "",
    onboarding_date: new Date(),
    social_media_profile_link: "",
    medha_area: "",
    status: "",
    program_name: "",
    specify_other: "",
  };

  if (props) {
    initialValues["mentor_name"] = props.mentor_name;
    initialValues["email"] = props.email;
    initialValues["mentor_domain"] = props.mentor_domain;
    initialValues["mentor_company_name"] = props.mentor_company_name;
    initialValues["assigned_to"] = props.assigned_to.id.toString();
    initialValues["program_name"] = props.program_name;
    initialValues["onboarding_date"] = new Date(props.onboarding_date);
    initialValues["designation"] = props.designation;
    initialValues["mentor_area"] = props?.mentor_area;
    initialValues["mentor_state"] = props.mentor_state;
    initialValues["medha_area"] = props.medha_area;
    initialValues["status"] = props.status;
    initialValues["outreach"] = props.outreach;
    initialValues["contact"] = props.contact;
    initialValues["social_media_profile_link"] = props.social_media_profile_link;
    initialValues["specify_other"] = props.specify_other;
  }

  useEffect(async () => {
    let data = await getOpsPickList().then((data) => {
      return data.program_name.map((value) => ({
        key: value,
        label: value,
        value: value,
      }));
    });

    setProgramName(data);
  }, []);

  // const mentorshipValidation = Yup.object().shape({
  //   email: Yup.required("Query Start date is required"),
  //   query_end: Yup.date()
  //     .nullable()
  //     .when("query_start", (start, schema) => {
  //       return schema.min(
  //         start,
  //         "Query End date must be greater than or equal to Query start date"
  //       );
  //     }),
  // });

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
              className="d-flex  justify-content-evenly"
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
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={mentorshipValidations}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="row form_sec">
                    <Section>
                      <h3 className="section-header">Basic Info</h3>
                      <div className="row">
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="input"
                            name="mentor_name"
                            label="Mentor Name"
                            required
                            className="form-control"
                            placeholder="Mentor Name"
                          />
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          {assigneeOptions.length && (
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
                          )}
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="program_name"
                            label="Program Name"
                            required
                            options={programeName}
                            className="form-control"
                            placeholder="Program Name"
                          />
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            control="lookupAsync"
                            name="status"
                            label="Status "
                            required
                            defaultOptions={statusOption}
                            className="form-control1"
                            placeholder="Status"
                          />
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          {
                            <Input
                              control="lookupAsync"
                              name="outreach"
                              label="Outreach (Offline/Online)"
                              //   filterData={filterInstitution}
                              defaultOptions={options}
                              placeholder="Outreach (Offline/Online)"
                              className="form-control"
                              isClearable
                              required
                            />
                          }
                        </div>

                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            name="onboarding_date"
                            label="Onboarding Date"
                            placeholder="Onboarding Date"
                            control="datepicker"
                            className="form-control"
                            autoComplete="off"
                            required
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                              icon="down"
                              name="medha_area"
                              label="Medha Area"
                              control="lookup"
                              options={districtOption}
                              placeholder="Area"
                              className="form-control"
                              required
                            />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="input"
                            name="email"
                            label="Email"
                            className="form-control"
                            placeholder="Email"
                            required
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="input"
                            name="social_media_profile_link"
                            label="Social Media"
                            className="form-control"
                            placeholder="Social Media"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="input"
                            name="mentor_domain"
                            label="Mentor's Domain"
                            className="form-control"
                            placeholder="Mentor's Domain"
                            required
                            onChange={(e) => {
                              setFieldValue('mentor_domain', e.target.value);
                              setShowSpecifyOthers(e.target.value === 'Others');
                            }}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            icon="down"
                            control="input"
                            name="mentor_company_name"
                            label="Mentor's Company Name"
                            className="form-control"
                            placeholder="Mentor's Company Name"
                            required
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            name="designation"
                            label="Designation/Title"
                            placeholder="designation/Title"
                            control="input"
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                          <Input
                            name="contact"
                            label="Contact"
                            placeholder="Contact"
                            control="input"
                            className="form-control"
                            required
                          />
                        </div>
                        {showSpecifyOthers && (
                          <div className="col-md-6 col-sm-12 mb-2">
                            <Input
                              icon="down"
                              control="input"
                              name="specify_other"
                              label="Specify Others"
                              className="form-control"
                              placeholder="Specify Others"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </Section>
                    <Section>
                      <h3 className="section-header">Address</h3>
                      <div className="row">
                        <div className="col-md-6 col-sm-12 mb-2">
                          {stateOptions.length ? (
                            <Input
                              icon="down"
                              name="mentor_state"
                              label="Mentor State"
                              control="lookup"
                              options={stateOptions}
                              onChange={onStateChange}
                              placeholder="State"
                              className="form-control"
                            />
                          ) : (
                            <Skeleton count={1} height={45} />
                          )}
                        </div>
                        <div className="col-md-6 col-sm-12 mb-2">
                         
                            <Input
                              icon="down"
                              name="mentor_area"
                              label="Mentor Area"
                              control="lookup"
                              options={areaOptions}
                              placeholder="Area"
                              className="form-control"
                            />
                          {/* ) : (
                            <>
                              <Skeleton count={1} height={45} />
                            </>
                          )} */}
                        </div>
                      </div>
                    </Section>

                    <Section>
                      <h3 className="section-header">Other Information</h3>
                      <div className="row">
                        <div className="col-md-6">
                          <DetailField
                            label="Updated By"
                            value={
                              props.updatedby?.userName
                                ? props.updatedby?.userName
                                : props.createdby?.username
                            }
                          />
                          <DetailField
                            label="Updated At"
                            value={moment(
                              props.updated_at
                                ? props.updated_at
                                : props.created_at
                            ).format("DD MMM YYYY, h:mm a")}
                          />
                        </div>
                        <div className="col-md-6">
                          <DetailField
                            label="Created By"
                            value={
                              props.createdby?.username
                                ? props.createdby?.username
                                : ""
                            }
                          />
                          <DetailField
                            label="Created At"
                            value={moment(props.created_at).format(
                              "DD MMM YYYY, h:mm a"
                            )}
                          />
                        </div>
                      </div>
                    </Section>
                  </div>

                  <div className="row justify-content-end mt-1">
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

export default UpdateMentorship;
