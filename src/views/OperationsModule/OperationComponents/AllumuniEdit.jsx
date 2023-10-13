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
import { getAlumniPickList, updateAlumniQuery, updateOpsActivity, updateSamarthSdit } from "./operationsActions";
import { handleKeyPress, handleKeyPresscharandspecialchar, mobileNochecker } from "../../../utils/function/OpsModulechecker";
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

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});
const Statusoptions = [
  { value: 'Open', label: "Open" },
  { value: 'Resolved', label: "Resolved" },
  { value: 'Closed', label: "Closed" }
];

const AllumuniEdit = (props) => {
  let { onHide, show } = props;

  const [assigneeOptions, setAssigneeOptions] = useState([]);

  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [queryTypes,setQueryType]=useState([])
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

  const onSubmit = async (values) => {
    

    const newObject  = {...values}

    newObject["query_start"] = moment(values["query_start"]).format("YYYY-MM-DD");
    newObject["query_end"] = moment(values["query_end"]).format("YYYY-MM-DD");

    delete newObject['published_at'];
    const value = await updateAlumniQuery(Number(props.id), newObject);
    setDisableSaveButton(true);
    onHide(value);
    setDisableSaveButton(false);
  };

  const userId = localStorage.getItem("user_id");
  // console.log("userId", props.assigned_to.id);
  let initialValues = {
    query_start: "",
    student_name: "",
    father_name: "",
    email: "",
    phone: "",
    location: "",
    query_type: "",
    query_desc: "",
    conclusion: "",
    status: "",
    query_end: "",
    published_at: "",
  };

  function formatDateStringToIndianStandardTime(dateString) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const date = new Date(dateString);
    console.log("date____123",date);
    return date
  }
  if (props) {
    // initialValues ={...props.dtedata}
    initialValues["father_name"] = props.father_name;
    initialValues["email"] = props.email;
    initialValues["phone"] = props.phone;
    initialValues["location"] = props.location;
    initialValues["status"] = props.status;
    initialValues["query_desc"] = props.query_desc;
    initialValues['query_type']=props.query_type
    initialValues["student_name"] = props.student_name;
    initialValues["query_start"] =  new Date(props.query_start) 
    initialValues["query_end"] =   new Date(props.query_end)
    initialValues['conclusion']=props.conclusion
  }



  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
    getAlumniPickList().then((data) => {
      setAreaOptions(
        data.medha_area.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setQueryType(
        data.query_type.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
    });
    
  }, []);

  // console.log("props",initialValues.batch);

  const [selectedOption, setSelectedOption] = useState(null); // State to hold the selected option

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
    const alumvalidation = Yup.object().shape({
    query_start: Yup.date().required("Query Start date is required"),
    query_end: Yup.date()
      .required("Query End date is required")
      .when("query_start", (start, schema) => {
        return schema.min(
          start,
          "Query End date must be greater than or equal to Query start date"
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
                {props.student_name ? props.student_name : "Add New Student"}
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Formik
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={alumvalidation}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <Section>
                    <h3 className="section-header">Basic Info</h3>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="student_name"
                          label="Student Name"
                          required
                          className="form-control"
                          placeholder="Student Name"
                          onKeyPress={handleKeyPresscharandspecialchar}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="father_name"
                          label=" Father Name"
                          required
                          className="form-control"
                          placeholder="Father Name"
                          onKeyPress={handleKeyPress}
                        />
                      </div>

                      {/*  */}

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="email"
                          label="Email ID"
                          // required
                          placeholder="Email"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="phone"
                          label="Mobile No."
                          onKeyPress={mobileNochecker}
                          className="form-control"
                          placeholder="Phone"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          name="status"
                          label="Status"
                          control="lookup"
                          options={Statusoptions}
                          // onChange={onStateChange}
                          placeholder="Status"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        

                        <Input
                          icon="down"
                          name="location"
                          label="Medha Area"
                          control="lookup"
                          options={areaOptions}
                          // onChange={onStateChange}
                          placeholder="Medha Area"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {/* <Input
                          icon="down"
                          control="input"
                          name="query_type"
                          label="Query Type"
                          onKeyPress={handleKeyPresscharandspecialchar}
                          className="form-control"
                          placeholder="Query Type"
                        /> */}
                         <Input
                          icon="down"
                          name="query_type"
                          label="Query Type"
                          control="lookup"
                          options={queryTypes}
                          // onChange={onStateChange}
                          placeholder="Query Type"
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="query_desc"
                          label="Query Description"
                          className="form-control"
                          placeholder="Query Description"
                        />
                      </div>
                      {/* query_start */}
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="query_start"
                          label="Query Start Date"
                          placeholder="Query Start"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="query_end"
                          label="Query End Date"
                          // required
                          placeholder="Query End Date"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>

                      {/* status */}

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="conclusion"
                          label="Conclusion"
                          className="form-control"
                          placeholder="Conclusion"
                        />
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

export default AllumuniEdit;
