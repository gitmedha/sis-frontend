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
import { updateOpsActivity, updateStudetnsUpskills } from "./operationsActions";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import { getUpskillingPicklist } from "../../Students/StudentComponents/StudentActions";
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
const categoryOptions = [
  { value: 'Career', label: "Career" },
  { value: 'Creative', label: "Creative" },
];

const UpskillUpdate = (props) => {
  let { onHide, show, closeopsedit } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [disablevalue, setdisablevalue] = useState(false);
  const [lookUpLoading, setLookUpLoading] = useState(false);
  const [course, setcourse] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [studentinput,setstudentinput]=useState("")
  const [subcategory,setSubcategory]=useState([])

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    getUpskillingPicklist().then((data) => {
      setSubcategory(data.subCategory.map((item) => ({
        key: item,
        value: item,
        label: item,
      })));
    });
  }, []);

  useEffect(() => {
    if (props.student_id.id) {
      filterStudent(props.student_id.full_name).then(data => {
        console.log("line 76",data);
        setStudentOptions(data);
      });
    }
  }, [props])

  const filterStudent = async (filterValue) => {
    console.log("filtervalue",filterValue);
    return await meilisearchClient.index('students').search(filterValue, {
      limit: 100,
      attributesToRetrieve: ['id', 'full_name', 'student_id']
    }).then(data => {
      let studentFoundInList = false;
      let filterData = data.hits.map(student => {
        if (student.id === Number(props?.id)) {
          studentFoundInList = true;
        }
        return {
          ...student,
          label: `${student.full_name} (${student.student_id})`,
          value: Number(student.id),
        }
      });
      // if (!studentFoundInList)  {
      //   filterData.unshift({
      //     label: programEnrollmentStudent.full_name,
      //     value: Number(programEnrollmentStudent.id),
      //   });
      // }
      return filterData;
    });
  }

  useEffect(() => {
    filterStudent(studentinput).then((data) => {
      setStudentOptions(data);
    });
  }, [studentinput]);
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

    const newObject = {...values};
   
    newObject["student_id"] = 57588;
    newObject["assigned_to"] = Number(values["assigned_to"]);

    newObject["start_date"] = moment(values["start_date"]).format("YYYY-MM-DD");
    newObject["end_date"] = moment(values["end_date"]).format("YYYY-MM-DD");
   
    const value = await updateStudetnsUpskills(Number(props.id), newObject);
    setDisableSaveButton(true);
    onHide(value);
    setDisableSaveButton(false);
  };
  function formatDateStringToIndianStandardTime(dateString) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date = new Date(dateString);
    return date;
  }

  const userId = localStorage.getItem("user_id");
  let initialValues = {
    assigned_to: "",
    student_id: "",
    institution: "",
    batch: "",
    start_date: "",
    end_date: "",
    course_name: "",
    certificate_received: "",
    category: "",
    sub_category: "",
    issued_org: "",
    published_at: "",
  };
  if (props) {
    initialValues["category"] = props.category;
    initialValues["sub_category"] = props.sub_category;
    initialValues["certificate_received"] = props.certificate_received;
    initialValues["issued_org"] = props.issued_org;
    initialValues["course_name"] = props["course_name"];
    console.log("props.student_id.id",props.student_id.id);
    initialValues['student_id']=Number(props.student_id.id);
    initialValues["start_date"] = formatDateStringToIndianStandardTime(
      props.start_date
    );
    initialValues["end_date"] = formatDateStringToIndianStandardTime(
      props.end_date
    );
    initialValues["published_at"] = new Date(props.published_at);
    initialValues["assigned_to"] = Number(props?.assigned_to?.id);
    initialValues["institution"] = Number(props?.institution?.id);
    initialValues["batch"] = Number(props?.batch?.id);
  }

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
  }, []);

  useEffect(() => {
    getProgramEnrollmentsPickList().then((data) => {
      setcourse(
        data?.course?.map((item) => ({ key: item, value: item, label: item }))
      );
    });
  }, []);

  // const [selectedOption, setSelectedOption] = useState(null); // State to hold the selected option

  const options = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];
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
                {props.id ? props.full_name : "Add New Student"}
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
                      <div className="col-md-6 col-sm-12 mt-2">
                        {!lookUpLoading ? (
                          <Input
                            name="student_id"
                            control="lookupAsync"
                            label="Student"
                            className="form-control"
                            placeholder="Student"
                            filterData={filterStudent}
                            defaultOptions={ props.student_id.id ? studentOptions : true }
                            required
                          />
                        ) : (
                          <Skeleton count={1} height={60} />
                        )}
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="lookup"
                          name="certificate_received"
                          label="Certificate Received"
                          required
                          className="form-control"
                          placeholder="Certificate Received"
                          options={options}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
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

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="lookupAsync"
                          name="batch"
                          label="Batch Name"
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
                      </div>

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
                          name="course_name"
                          control="lookup"
                          icon="down"
                          label="Course Name"
                          options={course}
                          className="form-control"
                          placeholder="Course Name"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {/* <Input
                          control="input"
                          name="category"
                          label="Category"
                          // required
                          className="form-control"
                          placeholder="Category"
                        /> */}
                        <Input
                          name="category"
                          control="lookup"
                          icon="down"
                          label="Category"
                          // required
                          className="form-control"
                          placeholder="Category"
                          options={categoryOptions}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {/* <Input
                        subcategory
                          icon="down"
                          control="input"
                          name="sub_category"
                          label="Sub Category"
                          // required
                          className="form-control"
                          placeholder="Sub Category"
                        /> */}
                         <Input
                          name="sub_category"
                          label="Sub Category"
                          control="lookup"
                          icon="down"
                          // required
                          className="form-control"
                          placeholder="Category"
                          options={subcategory}
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="issued_org"
                          label="Certificate Issuing Organization"
                          className="form-control"
                          placeholder="Certificate Issuing Organization"
                        />
                      </div>
                      {/* <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="published_at"
                          label="Publish Date "
                          // required
                          placeholder="Publish Date"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div> */}
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

export default UpskillUpdate;
