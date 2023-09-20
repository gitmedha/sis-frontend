import { Formik, Form, Field } from "formik";
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
import { updateOpsActivity, updateUserTot } from "./operationsActions";
import { getStudentsPickList } from "../../Students/StudentComponents/StudentActions";

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
  { value: "No", label: 'No' }
]

const TotEdit = (props) => {
  let { onHide, show } = props;
  const currentDate = new Date();
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    if (props.institution) {
      // console.log("props filterInstitution", props.institution)
      filterInstitution().then((data) => {
        setInstitutionOptions(data);
      });
    }
    if (props.batch) {
      filterBatch().then((data) => {
        console.log("dataBatch1:", data);
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
        // let programEnrollmentBatch = props.programEnrollment ? props.programEnrollment.batch : null;

        let filterData = data.hits.map((batch) => {
          return {
            ...batch,
            label: batch.name,
            value: Number(batch.id),
          };
        });

        console.log(filterData);
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

  useEffect(() => {
    getStudentsPickList().then((data) => {
      setGenderOptions(
        data.gender.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });
  }, [props]);

  const onSubmit = async (values) => {
    

    const newObject = {...values};


    newObject.start_date = values?.start_date
      ? values.start_date.toISOString().split("T")[0]
      : currentDate.toDateString().split("T")[0];

      newObject.end_date = values?.end_date
      ? values.end_date.toISOString().split("T")[0]
      : "";

      newObject.published_at = values?.published_at
      ? values.published_at
      : "";
    // delete values["start_date"];
    // delete values["end_date"];
    delete values["published_at"];
    delete values["trainer_1"];
    delete values["trainer_2"];
    const value = await updateUserTot(Number(props.id), newObject);

    setDisableSaveButton(true);
    onHide(value);
    
    setDisableSaveButton(false);
  };

  let initialValues = {
    start_date: "",
    end_date: "",
    project_name: "",
    certificate_given: "",
    module_name: "",
    project_type: "",
    new_entry: "",
    partner_dept: "",
    college: "",
    city: "",
    state: "",
    age: "",
    gender: "",
    contact: "",
    designation: "",
    published_at: "",
  };
  // { "Created At": "2023-04-19T12:18:24.383286Z", "Organization": "Goonj", "Activity Type": "Industry Talk/Expert Talk", "Institution": 329, "Updated At": null, "End Date": "2020-07-06", "Designation": "State Head(U.P)", "Start Date": "2020-07-06", "Assigned To": 123, "Other Links": "0", "Topic": "Goonj fellowship and NGO work", "Donor": false, "Batch": 162, "ID": 2201, "Updated By": null, "Students Attended": 14, "Created By": 2, "State": "Uttar Pradesh", "Area": "Gorakhpur (City)", "Guest": "Mr. Shushil Yadav" },

  if (props) {
    initialValues["module_name"] = props.module_name;
    initialValues["project_type"] = props.project_type;
    initialValues["new_entry"] = props.new_entry;
    initialValues["college"] = props.college;
    initialValues["partner_dept"] = props.partner_dept;
    initialValues["contact"] = props.contact;
    initialValues["designation"] = props.designation;
    initialValues["start_date"] = new Date(props.start_date);
    initialValues["end_date"] = new Date(props.end_date);
    initialValues["project_name"] = props?.project_name;
    initialValues["age"] = props.age;
    initialValues["gender"] = props.gender;
    initialValues["published_at"] = new Date(props.published_at);
    initialValues["state"] = props.state;
    initialValues["city"] = props.city;
  }

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
  }, []);

  // console.log("props",initialValues.batch);

  const [selectedOption, setSelectedOption] = useState(null); // State to hold the selected option

  const optionscertgiven = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

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
                {console.log(props)}
                {props.user_name ? props.user_name : `Edit tot Detail`}
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Formik onSubmit={onSubmit} initialValues={initialValues}>
              {({ values, setFieldValue }) => (
                <Form>
                  <Section>
                    <h3 className="section-header">Basic Info</h3>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="project_name"
                          label="Project Name"
                          className="form-control"
                          placeholder="Project Name"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="module_name"
                          label="Module Name"
                          required
                          className="form-control"
                          placeholder="Module Name"
                          // filterData={filterAssignedTo}
                          // defaultOptions={assigneeOptions}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="project_type"
                          label="Project Type"
                          required
                          className="form-control"
                          placeholder="Module Name"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                      <Input
                          icon="down"
                          control="lookup"
                          name="new_entry"
                          label="New Entry"
                          required
                          options={options}
                          className="form-control"
                          placeholder="New Entry"
                        />
                      </div>

                      {/* <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="lookupAsync"
                          name="batch"
                          label="Batch"
                          required
                          filterData={filterBatch}
                          defaultOptions={batchOptions}
                          className="form-control1"
                          placeholder="Batch"
                        />

                        
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="lookupAsync"
                          name="institution"
                          label="Institution"
                          filterData={filterInstitution}
                          defaultOptions={institutionOptions}
                          placeholder="Institution"
                          className="form-control"
                          isClearable
                        />
                      </div> */}

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="start_date"
                          label="Start Date "
                          // required
                          placeholder="Start Date"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="end_date"
                          label="End Date"
                          // required
                          placeholder="End Date"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="partner_dept"
                          label="Partner Department"
                          // required
                          className="form-control"
                          placeholder="Partner Department"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="college"
                          label="College"
                          // required
                          className="form-control"
                          placeholder="College"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="age"
                          label="Age"
                          // required
                          className="form-control"
                          placeholder="Guest"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="lookup"
                          name="gender"
                          label="Gender"
                          required
                          options={genderOptions}
                          className="form-control"
                          placeholder="Gender"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="contact"
                          label="Contact"
                          className="form-control"
                          placeholder="Contact"
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
                          name="published_at"
                          label="Publish Date "
                          // required
                          placeholder="Publish Date"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
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
                            name="city"
                            label="City"
                            control="lookup"
                            options={areaOptions}
                            placeholder="City"
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
                          label="Creted By"
                          value={
                            props.Created_by?.username
                              ? props.Created_by?.username
                              : ""
                          }
                        />
                        <DetailField
                          label="Created At "
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

export default TotEdit;
