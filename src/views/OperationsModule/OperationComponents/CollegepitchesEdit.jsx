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
  getAllSrm,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import AsyncSelect from "react-select/async";
import { MeiliSearch } from "meilisearch";
import { Select } from "@material-ui/core";
// import 'react-select/dist/react-select.css';
import { MenuItem } from "material-ui";
import DetailField from "../../../components/content/DetailField";
import moment from "moment";
import { getPitchingPickList, updateCollegePitch, updateOpsActivity, updateSamarthSdit } from "./operationsActions";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import { handleKeyPress, mobileNochecker, numberChecker } from "../../../utils/function/OpsModulechecker";

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

const CollepitchesEdit = (props) => {
  let { onHide, show } = props;
  const [srmOption, setsrmOption] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [course, setcourse] = useState([]);
  const [colleges,setCollege]=useState([])
  const [currentCourseYearOptions, setCurrentCourseYearOptions] = useState([]);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
  }, []);

  useEffect(() => {
    if (props.institution) {
      filterInstitution().then((data) => {
        setInstitutionOptions(data);
      });
    }
    if (props.batch) {
      filterBatch().then((data) => {
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
        return filterData;
      });
  };

  useEffect(async () => {
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

      // if (props.state) {
      //   onStateChange({ value: props.state });
      // }
    });
    let data = await getAllSrm(1);
    setsrmOption(data);
    getProgramEnrollmentsPickList().then((data) => {
      setcourse(
        data?.course?.map((item) => ({ key: item, value: item, label: item }))
      );
      setCurrentCourseYearOptions(
        data.current_course_year.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });
    
    getPitchingPickList().then((data) => {
      setCollege(
        data.college_name.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
      setAreaOptions(
        data.medha_area.map((item) => ({
          key: item,
          value: item,
          label: item,
        }))
      );
    });
  }, []);


  const onSubmit = async (values) => {
  
    const newObj = {...values};
    values.pitch_date ? newObj["pitch_date"] = moment(values["pitch_date"]).format("YYYY-MM-DD"): delete newObj['pitch_date'];
    const value = await updateCollegePitch(Number(props.id), newObj);
    setDisableSaveButton(true);
    onHide(value);
    setDisableSaveButton(false);
  };

  const userId = localStorage.getItem("user_id");
  let initialValues = {
    pitch_date: "",
    student_name: "",
    course_name: "",
    course_year: "",
    college_name: "",
    phone: "",
    whatsapp: "",
    email: "",
    remarks: "",
    srm_name: "",
    area: "",
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
  console.log(props.srm_name);
  if (props) {
    // initialValues ={...props.dtedata}
    initialValues["email"] = props.email;
    initialValues["phone"] = props.phone;
    initialValues["course_name"] = props.course_name;
    initialValues["course_year"] = props.course_year;
    initialValues["college_name"] = props.college_name;
    initialValues["srm_name"] = props.srm_name.id.toString();
    initialValues["student_name"] = props.student_name;
    initialValues["pitch_date"] = props.pitch_date
      ? formatDateStringToIndianStandardTime(props.pitch_date)
      : "";
    initialValues["remarks"] = props.remarks;
    initialValues['area']=props.area;
  }

  useEffect(() => {
    if (props.institution) {
      filterInstitution(props.institution.name).then((data) => {
        setInstitutionOptions(data);
      });
    }
  }, []);

  const [selectedOption, setSelectedOption] = useState(null); // State to hold the selected option

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
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
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="student_name"
                          label="Student Name"
                          required
                          onKeyPress={handleKeyPress}
                          className="form-control"
                          placeholder="Student Name"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="course_name"
                          control="lookup"
                          icon="down"
                          label="Course Name"
                          options={course}
                          onKeyPress={handleKeyPress}
                          className="form-control"
                          placeholder="Course Name"
                        />
                      </div>

                      {/*  */}

                      <div className="col-md-6 col-sm-12 mb-2">
                        {/* <Input
                          name="course_year"
                          label="Course Year"
                          placeholder="Course Year"
                          onKeyPress={numberChecker}
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        /> */}
                        <Input
                          name="course_year"
                          label="Course Year"
                          control="lookup"
                          icon="down"
                          options={currentCourseYearOptions}
                          onKeyPress={handleKeyPress}
                          className="form-control"
                          placeholder="Course Year"
                        />
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="college_name"
                          label="College Name"
                          control="lookup"
                          icon="down"
                          options={colleges}
                          onKeyPress={handleKeyPress}
                          className="form-control"
                          placeholder="College Name"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="phone"
                          label="Phone"
                          onKeyPress={mobileNochecker}
                          className="form-control"
                          placeholder="Phone"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="whatsapp"
                          label="Whatsapp Number"
                          onKeyPress={mobileNochecker}
                          className="form-control"
                          placeholder="Whatsapp Number"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="email"
                          label="Email ID"
                          className="form-control"
                          placeholder="Email ID"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="remarks"
                          label="Remarks"
                          className="form-control"
                          placeholder="Remarks"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {/* <Input
                          name="srm_name"
                          label="SRM Name"
                          placeholder="SRM Name"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        /> */}
                        <Input
                          name="srm_name"
                          label="SRM Name"
                          placeholder="SRM Name"
                          control="lookup"
                          icon="down"
                          options={srmOption}
                          onKeyPress={handleKeyPress}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="area"
                          label="Medha Area"
                          control="lookup"
                          icon="down"
                          options={areaOptions}
                          onKeyPress={handleKeyPress}
                          className="form-control"
                          placeholder="Medha Area"
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

export default CollepitchesEdit;
