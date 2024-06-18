import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import Select, { components } from "react-select";
import {
  getEmployerOpportunities,
  getEmploymentConnectionsPickList,
  getStudentEmploymentConnections,
  searchStudents,
  searchEmployers
} from "../StudentComponents/StudentActions";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { Input } from "../../../utils/Form";
import { filterAssignedTo } from "../../../utils/function/lookupOptions";
import Skeleton from "react-loading-skeleton";
import { FaTimes } from "react-icons/fa";

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

const EmploymentmassEdit = (props) => {
  const [studentOptions, setStudentOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentInput, setStudentInput] = useState("");
  const [formStatus, setFormStatus] = useState(false);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [employerOptions, setEmployerOptions] = useState([]);
  const [allStatusOptions, setAllStatusOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [employerOpportunityOptions, setEmployerOpportunityOptions] = useState(
    []
  );
  const [workEngagementOptions, setWorkEngagementOptions] = useState([]);
  const [selectedOpportunityType, setSelectedOpportunityType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showEndDate, setShowEndDate] = useState(false);
  const [endDateMandatory, setEndDateMandatory] = useState(false);
  const [rejectionreason, setrejectionreason] = useState([]);
  const [isRejected, setRejected] = useState(false);
  const [ifSelectedOthers, setIfSelectedOthers] = useState(false);
  const [EmploymentData, setEmploymentData] = useState("");

  let initialValues = {
    employment_connection_student: "",
    employer_id: "",
    opportunity_id: "",
    status: "",
    start_date: null,
    end_date: null,
    source: "",
    salary_offered: "",
    reason_if_rejected: "",
    reason_if_rejected_other: "",
    assigned_to: "",
  };

  const filterStudent = async (filterValue) => {
    try {
      const {data} = await searchStudents(filterValue);
      
      let filterData = data.studentsConnection.values.map((student) => {
        return {
          ...student,
          label: `${student.full_name} (${student.student_id})`,
          value: Number(student.id),
        };
      });

      return filterData;

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    filterStudent(studentInput).then((data) => {
      setStudentOptions(data);
    });
  }, [studentInput]);

  const updateEmployerOpportunityOptions = (employer) => {
    setEmployerOpportunityOptions([]);
    getEmployerOpportunities(Number(employer)).then((data) => {
      setEmployerOpportunityOptions(
        data?.data?.data?.opportunities.map((opportunity) => ({
          key: opportunity.role_or_designation,
          label: `${opportunity.role_or_designation} | ${opportunity.type}`,
          type: opportunity.type,
          value: opportunity.id,
        }))
      );
    });
  };

  useEffect(() => {
    const employers = async () => await filterEmployer();
    employers();
  }, []);

  useEffect(() => {
    getEmploymentConnectionsPickList().then((data) => {
      setrejectionreason(
        data.reason_if_rejected?.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
      setWorkEngagementOptions(
        data.work_engagement.map((item) => ({
          ...item,
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
      
      setAllStatusOptions(
        data.status.map((item) => ({
          ...item,
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
      setSourceOptions(
        data.source.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });
    filterEmployer().then((data) => {
      setEmployerOptions(data);
    });
    setStatusOptions(
      allStatusOptions.map((item) => {
        if (
          localStorage.getItem("user_role")?.toLowerCase() === "srm" &&
          item.value.toLowerCase() === "unknown"
        ) {
          return { isDisabled: true };
        } else {
          return { key: item.value, value: item.value, label: item.value };
        }
      })
    );
  }, []);

  useEffect(() => {
    let filteredOptions = allStatusOptions;
    if (
      selectedOpportunityType === "Job" ||
      selectedOpportunityType === "Internship" ||
      selectedOpportunityType === "UnPaid GIG" ||
      selectedOpportunityType === "Paid GIG" ||
      selectedOpportunityType === "Apprenticeship"
    ) {
      filteredOptions = allStatusOptions.filter(
        (item) =>
          item["applicable-to"].includes(selectedOpportunityType) ||
          item["applicable-to"] === "Both"
      );
    } else {
      filteredOptions = allStatusOptions.filter(
        (item) => item["applicable-to"] === "Both"
      );
    }
    setStatusOptions(filteredOptions);
  }, [selectedOpportunityType, allStatusOptions]);

  const filterEmployer = async (filterValue) => {
    try {
      const {data} = await searchEmployers(filterValue);
      let filterData = data.employersConnection.values.map((employer) => {
        return {
          ...employer,
          label: employer.name,
          value: Number(employer.id),
        };
      });
      setEmployerOptions(filterData);

    } catch (error) {
     console.error(error); 
    }
  };

  const handleSubmit = async (values) => {
    try {
      let alumData = await Promise.all(
        students.map(async (obj) => {
          try {
            let data = await getStudentEmploymentConnections(obj.id);

            return data.data.data.employmentConnectionsConnection.values.map(
              (val) => ({
                assigned_to: val.assigned_to.id,
                experience_certificate: val.experience_certificate,
                number_of_internship_hours: val.number_of_internship_hours,
                end_date: val.end_date,
                opportunity: {
                  value: val.opportunity.id,
                  label: val.opportunity.type,
                },
                employer: {
                  value: val.opportunity.employer.id,
                  label: val.opportunity.employer.name,
                },
                reason_if_rejected: val.reason_if_rejected,
                reason_if_rejected_other: val.reason_if_rejected_other,
                salary_offered: val.salary_offered,
                start_date: val.start_date,
                source: val.source,
                status: val.status,
                student_id: obj.id,
                work_engagement: val.work_engagement,
                id: val.id,
              })
            );
          } catch (err) {
            console.error(err);
            return [];
          }
        })
      );
      setEmploymentData(alumData.flat());
      setFormStatus(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handelChange = (id, newData) => {
    return setStudents(
      students.map((obj) => {
        if (obj.id === id) {
          if (newData.hasOwnProperty("opportunity")) {
            
            let data = { opportunity: newData.opportunity };
            return { ...obj, ...data };
          } else if (newData.hasOwnProperty("employer")) {
            
            let employerEntryChange = { employer: newData.employer };
            return { ...obj, ...employerEntryChange };
          } else if (
            typeof obj.opportunity === "object" &&
            obj.opportunity !== null
          ) {
            obj.opportunity = obj.opportunity.value;
          } else if (obj.employer === "object" && obj.employer !== null) {
            obj.employer = obj.employer.value;
          } else {
            return { ...obj, ...newData };
          }
        }

        return obj;
      })
    );
  };

  const uploadData = async () => {
    const modifiedStudents = students.map((obj) => {
      if (typeof obj.opportunity === "object" && obj.opportunity !== null) {
        obj.opportunity = obj.opportunity.value;
      }
      if (typeof obj.employer === "object" && obj.employer !== null) {
        obj.employer = obj.employer.value;
      }
      return obj;
    });

    props.handelSubmitMassEdit(modifiedStudents, "EmployerBulkdEdit");
  };

  const handleStatusChange = async (value) => {
    setSelectedStatus(value);

    if (value === "Rejected by Employer") {
      setRejected(true);
    } else if (value === "Student Dropped Out") {
      setRejected(true);
    } else if (value === "Offer Rejected by Student") {
      setRejected(true);
    } else {
      setRejected(false);
    }
  };

  const handelCancel = () => {
    props.handelCancel();
  };

  const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 1; // Maximum number of values to show
    const overflowCount = getValue().length - maxToShow;

    if (index < maxToShow) {
      return <components.MultiValue {...props} />;
    }

    if (index === maxToShow) {
      return (
        <components.MultiValue {...props}>
          <span>+{overflowCount}</span>
        </components.MultiValue>
      );
    }

    return null;
  };

  const customComponents = {
    MultiValue,
  };

  const handleInputChange = (inputValue) => {
    setStudentInput(inputValue);
  };

  const handleselectChange = (selectedOptions) => {
    setStudents(selectedOptions);
  };
  const onSubmit = async (values) => {
    console.log(EmploymentData.flat());
    let data = EmploymentData.map((val) => {
      return {
        assigned_to: values.assigned_to.id,
        experience_certificate: values.experience_certificate,
        number_of_internship_hours: values.number_of_internship_hours,
        end_date: values.end_date,
        opportunity: values.opportunity_id,
        employer: values.employer_id,
        reason_if_rejected: values.reason_if_rejected,
        reason_if_rejected_other: values.reason_if_rejected_other,
        salary_offered: values.salary_offered,
        start_date: values.start_date,
        source: values.source,
        status: values.status,
        student_id: val.student_id,
        work_engagement: values.work_engagement,
        id: val.id,
      };
    });
    props.handelSubmitMassEdit(data, "EmployerBulkdEdit");
  };

  return (
    <>
      <Modal
        centered
        size="lg"
        responsive
        show={true}
        aria-labelledby="contained-modal-title-vcenter"
        className="form-modal"
        // dialogClassName="fullscreen-modal"
      >
        {!formStatus && (
          <>
            <Modal.Header>
              <div className="d-flex justify-content-end align-items-center">
                <button
                  onClick={handelCancel}
                  style={{
                    border: "none",
                    background: "none",
                    position: "absolute",
                    right: "2rem",
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            </Modal.Header>
            <Modal.Body className="bg-white" height="">
              <div className=" col-sm-12 px-3 d-flex flex-column justify-content-around">
                <div>
                  <label className="leading-24">Student</label>
                  <Select
                    isMulti
                    name="student_ids"
                    options={studentOptions}
                    closeMenuOnSelect={false}
                    components={customComponents}
                    isOptionDisabled={() => students.length >= 10}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onInputChange={(e) => setStudentInput(e)}
                    onChange={handleselectChange}
                    value={students}
                  />
                </div>
                <div className="d-flex justify-content-end mx-5">
                  <button
                    className="btn btn-primary mt-3 "
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Modal.Body>
          </>
        )}

        {formStatus &&
          (students.length > 0 ? (
            <>
              <Modal.Header className="bg-white">
                <Modal.Title
                  id="contained-modal-title-vcenter"
                  className="d-flex align-items-center"
                >
                  <h1 className="text--primary bebas-thick mb-0">
                    Mass Edit Employment Connection
                  </h1>
                </Modal.Title>
              </Modal.Header>
              <Formik
                onSubmit={onSubmit}
                initialValues={initialValues}
                // validationSchema={validations}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <Section>
                      <div className="row px-3 form_sec">
                        <div className="col-md-6 col-sm-12 mt-2">
                          <Select
                            isMulti
                            isDisabled={true}
                            name="student_ids"
                            defaultValue={students}
                            components={customComponents}
                            options={studentOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            control="lookupAsync"
                            name="assigned_to"
                            label="Assigned To"
                            className="form-control"
                            placeholder="Assigned To"
                            filterData={filterAssignedTo}
                            defaultOptions={assigneeOptions}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            control="lookupAsync"
                            name="employer_id"
                            label="Employer"
                            filterData={filterEmployer}
                            defaultOptions={employerOptions}
                            className="form-control"
                            placeholder="Employer"
                            onChange={(employer) => {
                              setSelectedOpportunityType(null);
                              updateEmployerOpportunityOptions(employer.value);
                            }}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mt-2">
                          {employerOpportunityOptions.length ? (
                            <Input
                              icon="down"
                              control="lookup"
                              name="opportunity_id"
                              label="Opportunity"
                              options={employerOpportunityOptions}
                              className="form-control"
                              placeholder={"Opportunity"}
                              onChange={(e) =>
                                setSelectedOpportunityType(e.type)
                              }
                            />
                          ) : (
                            <>
                              <label
                                className="text-heading"
                                style={{ color: "#787B96" }}
                              >
                                Opportunity (select an employer first)
                              </label>
                              <Skeleton count={1} height={35} />
                            </>
                          )}
                        </div>
                        <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="status"
                            label="Status"
                            options={statusOptions}
                            className="form-control"
                            placeholder="Status"
                            onChange={(e) => handleStatusChange(e.value)}
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            name="start_date"
                            label="Start Date"
                            placeholder="Start Date"
                            control="datepicker"
                            className="form-control"
                            autoComplete="off"
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            min={0}
                            type="number"
                            name="salary_offered"
                            control="input"
                            label="Salary Offered"
                            // required
                            className="form-control"
                            placeholder="Salary Offered"
                          />
                        </div>
                        {showEndDate && (
                          <div className="col-md-6 col-sm-12 mt-2">
                            <Input
                              name="end_date"
                              label="End Date"
                              placeholder="End Date"
                              control="datepicker"
                              className="form-control"
                              autoComplete="off"
                              // required={endDateMandatory}
                            />
                          </div>
                        )}
                        <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="source"
                            label="Source"
                            options={sourceOptions}
                            className="form-control"
                            placeholder="Source"
                          />
                        </div>

                        {isRejected ||
                        (initialValues.reason_if_rejected &&
                          initialValues.reason_if_rejected.length) ? (
                          <div className="col-md-6 col-sm-12 mt-2">
                            <Input
                              icon="down"
                              control="lookup"
                              name="reason_if_rejected"
                              label="Reason if Rejected"
                              // required={
                              //   selectedStatus === "Offer Rejected by Student"
                              // }
                              options={rejectionreason}
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue("reason_if_rejected", e.value);
                                if (e.value === "Others") {
                                  setIfSelectedOthers(true);
                                } else {
                                  setIfSelectedOthers(false);
                                }
                              }}
                              placeholder="Reason if Rejected"
                            />
                          </div>
                        ) : (
                          <div></div>
                        )}
                        {ifSelectedOthers ||
                        (initialValues.reason_if_rejected_other &&
                          initialValues.reason_if_rejected_other.length) ? (
                          <div className="col-md-6 col-sm-12 mt-2">
                            <Input
                              name="reason_if_rejected_other"
                              control="input"
                              label="If Other, Specify"
                              className="form-control"
                              placeholder="If Other, Specify"
                            />
                          </div>
                        ) : (
                          <div></div>
                        )}
                        <div className="col-md-6 col-sm-12 mt-2">
                          <Input
                            icon="down"
                            control="lookup"
                            name="work_engagement"
                            label="Work Engagement"
                            options={workEngagementOptions}
                            className="form-control"
                            placeholder="Work Engagement"
                          />
                        </div>

                        {selectedOpportunityType === "Internship" && (
                          <div className="col-md-6 col-sm-12 mt-2">
                            <Input
                              min={0}
                              type="number"
                              control="input"
                              name="number_of_internship_hours"
                              className="form-control"
                              label="Number of Internship hours"
                              placeholder="Number of Internship hours"
                            />
                          </div>
                        )}
                      </div>
                    </Section>

                    <div className="row justify-content-end mt-3 mb-2 mx-5 ">
                      <div className="col-auto p-0">
                        <button
                          type="button"
                          onClick={handelCancel}
                          className="btn btn-secondary btn-regular collapse_form_buttons"
                        >
                          CANCEL
                        </button>
                      </div>
                      <div className="col-auto p-0">
                        <button
                          type="submit"
                          className="btn btn-primary btn-regular collapse_form_buttons"
                        >
                          SAVE
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            <div className="">
              <button
                className="btn submitbtnclear btn-danger btn-regular my-5"
                onClick={() => handelCancel()}
              >
                Jump Back to previous page
              </button>
            </div>
          ))}
      </Modal>
    </>
  );
};

export default EmploymentmassEdit;
