import { Formik, Form, Field, ErrorMessage } from "formik";
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaSchool } from "react-icons/fa";
import { Input } from "../../../utils/Form";
import { StudentValidations } from "../../../validations";
import { urlPath } from "../../../constants";
import {
  getAddressOptions,
  getStateDistricts,
} from "../../Address/addressActions";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import AsyncSelect from "react-select/async";
import { MeiliSearch } from "meilisearch";
import { Select } from "@material-ui/core";
// import 'react-select/dist/react-select.css';
import { MenuItem } from "material-ui";
import DetailField from "../../../components/content/DetailField";
import moment from "moment";
import { updateOpsActivity } from "./operationsActions";
import * as Yup from "yup";
import { numberChecker } from "../../../utils/function/OpsModulechecker";

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

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const options = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const OperationDataupdateform = (props) => {
  console.log(props, "props");
  let { onHide, show, closeopsedit } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [disablevalue, setdisablevalue] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      console.log("data", data);
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
    if (props.batch) {
      filterBatch(props.batch.name).then((data) => {
        setBatchOptions(data);
      });
    }
  }, [props]);

  const filterInstitution = async (filterValue) => {
    return await meilisearchClient
      .index("institutions")
      .search(filterValue, {
        limit: 100,
        attributesToRetrieve: ["id", "name"],
      })
      .then((data) => {
        let filterData = data.hits.map((institution) => {
          return {
            ...institution,
            label: institution.name,
            value: Number(institution.id),
          };
        });

        return filterData;
      });
  };

  const filterBatch = async (filterValue) => {
    return await meilisearchClient
      .index("batches")
      .search(filterValue, {
        limit: 100,
        attributesToRetrieve: ["id", "name"],
      })
      .then((data) => {
        let batchInformtion = props ? props.batch : null;
        let batchFoundInList = false;

        let filterData = data.hits.map((batch) => {
          if (props && batch.id === Number(batchInformtion?.id)) {
            batchFoundInList = true;
          }
          return {
            ...batch,
            label: batch.name,
            value: Number(batch.id),
          };
        });
        if (props && batchInformtion !== null && !batchFoundInList) {
          filterData.unshift({
            label: batchInformtion.name,
            value: Number(batchInformtion.id),
          });
        }
        return filterData;
      });
  };

  useEffect(() => {
    getAddressOptions().then((data) => {
      setStateOptions(
        data?.data?.data?.geographiesConnection.groupBy.state
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
  }, []);

  const onStateChange = async (value) => {
    await getStateDistricts(value).then((data) => {
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection?.groupBy?.area
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
  };

  const onSubmit = async (values) => {
    const newValueObject = { ...values };
    newValueObject["assigned_to"] = Number(values["assigned_to"]);
    newValueObject["batch"] = Number(values["batch"]);
    newValueObject["students_attended"] = Number(values["students_attended"]);
    newValueObject["start_date"] = moment(values["start_date"]).format(
      "YYYY-MM-DD"
    );
    newValueObject["end_date"] = moment(values["end_date"]).format(
      "YYYY-MM-DD"
    );
    newValueObject["institution"] = Number(values["institution"]);
    newValueObject["donor"] = values["donor"] === "Yes" || "yes" ? true : false;
    newValueObject["Updated_by"] = Number(userId);

    delete newValueObject["updated_by"];
    delete newValueObject["updated_at"];
    delete newValueObject["created_at"];
    delete newValueObject["created_by"];
    delete newValueObject["institute_name"];

    // const errors = {};
    // const { start_date, end_date } = newValueObject;

    // if (!start_date || !end_date) {
    //   errors.start_date = "Start date is required";
    //   errors.end_date = " End date is required";
    //   return;
    // } else if (start_date >= end_date) {
    //   errors.start_date = "Start date must be earlier than end date";
    //   errors.end_date = "End date must be later than start date";
    //   return;
    // }

    const value = await updateOpsActivity(Number(props.id), newValueObject);
    setDisableSaveButton(true);
    onHide(value);
    closeopsedit();
    setDisableSaveButton(false);
  };

  const userId = localStorage.getItem("user_id");
  let initialValues = {
    topic: "",
    assigned_to: props.assigned_to.id.toString(),
    state: "",
    activity_type: "",
    institution: "",
    guest: "",
    organization: "",
    updated_at: "",
    start_date: "",
    end_date: "",
    designation: "",
    updated_by: "",
    area: "",
    students_attended: "",
    batch: "",
  };
  // { "Created At": "2023-04-19T12:18:24.383286Z", "Organization": "Goonj", "Activity Type": "Industry Talk/Expert Talk", "Institution": 329, "Updated At": null, "End Date": "2020-07-06", "Designation": "State Head(U.P)", "Start Date": "2020-07-06", "Assigned To": 123, "Other Links": "0", "Topic": "Goonj fellowship and NGO work", "Donor": false, "Batch": 162, "ID": 2201, "Updated By": null, "Students Attended": 14, "Created By": 2, "State": "Uttar Pradesh", "Area": "Gorakhpur (City)", "Guest": "Mr. Shushil Yadav" },

  if (props) {
    initialValues["batch"] = Number(props.batch.id);
    initialValues["institution"] = Number(props.institution.id);
    initialValues["topic"] = props.topic;
    initialValues["activity_type"] = props.activity_type;
    initialValues["assigned_to"] = props.assigned_to.id.toString();

    initialValues["start_date"] = new Date(props.start_date);
    initialValues["end_date"] = new Date(props.end_date);
    initialValues["students_attended"] = props?.students_attended;
    initialValues["created_at"] = props.created_at;
    initialValues["organization"] = props.organization;
    initialValues["designation"] = props.designation;
    initialValues["guest"] = props.guest;
    initialValues["state"] = props.state ? props.state : null;
    initialValues["institute_name"] = Number(props?.institution?.id);
    initialValues["donor"] = props.donor ? "Yes" : "No";
    initialValues["area"] = props.area ? props.area : null;
  }

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
  }, []);

  const operationvalidation = Yup.object().shape({
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date()
      .required("End date is required")
      .when("start_date", (start, schema) => {
        return schema.min(
          start,
          "End date must be greater than or equal to start date"
        );
      }),
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
              validationSchema={operationvalidation}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <Section>
                    <h3 className="section-header">Basic Info</h3>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="activity_type"
                          label="Activity Type"
                          className="form-control"
                          placeholder="Activity Type"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {assigneeOptions.length && (
                          <Input
                            control="lookupAsync"
                            name="assigned_to"
                            label="Assigned To"
                            className="form-control"
                            placeholder="Assigned To"
                            filterData={filterAssignedTo}
                            defaultOptions={assigneeOptions}
                          />
                        )}
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        {batchOptions.length && (
                          <Input
                            control="lookupAsync"
                            name="batch"
                            label="Batch"
                            filterData={filterBatch}
                            defaultOptions={batchOptions}
                            className="form-control1"
                            placeholder="Batch"
                          />
                        )}
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        {institutionOptions.length && (
                          <Input
                            control="lookupAsync"
                            name="institution"
                            label="Educational Institution"
                            filterData={filterInstitution}
                            defaultOptions={institutionOptions}
                            placeholder="Institution"
                            className="form-control"
                            isClearable
                          />
                        )}
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="start_date"
                          label="Start Date "
                          //
                          placeholder="Date of Birth"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                        {/* {validationErrors.start_date && (
                          <div className="error">
                            {validationErrors.start_date}
                          </div>
                        )} */}
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="end_date"
                          label="End Date"
                          placeholder="Date of Birth"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                       
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="lookup"
                          name="donor"
                          label="Donor"
                          required
                          options={options}
                          className="form-control"
                          placeholder="New Entry"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="topic"
                          label="Topic"
                          className="form-control"
                          placeholder="Topic"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="guest"
                          label="Guest"
                          className="form-control"
                          placeholder="Guest"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="designation"
                          label="Designation"
                          className="form-control"
                          placeholder="Designation"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="organization"
                          label="Organization"
                          className="form-control"
                          placeholder="Organization"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="students_attended"
                          label="Student Attended"
                          placeholder="Student atended"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                          onKeyPress={numberChecker}
                        />
                      </div>
                    </div>
                  </Section>
                  <Section>
                    <h3 className="section-header">Address</h3>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mb-2">
                        {stateOptions.length ? (
                          <Input
                            icon="down"
                            name="state"
                            label="State"
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
                        {areaOptions.length ? (
                          <Input
                            icon="down"
                            name="area"
                            label="Medha Area"
                            control="lookup"
                            options={areaOptions}
                            placeholder="Area"
                            className="form-control"
                          />
                        ) : (
                          <>
                            <Skeleton count={1} height={45} />
                          </>
                        )}
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
                            props.Updated_by?.userName
                              ? props.Updated_by?.userName
                              : props.Created_by?.username
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
                            props.Created_by?.username
                              ? props.Created_by?.username
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

                  <div className="row mt-3 py-3">
                    <div className="d-flex justify-content-start">
                      <button
                        className="btn btn-primary btn-regular mx-0"
                        type="submit"
                        disabled={disableSaveButton}
                      >
                        SAVE
                      </button>
                      <button
                        type="button"
                        onClick={onHide}
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
      )}
    </>
  );
};

export default OperationDataupdateform;
