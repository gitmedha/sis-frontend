import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Input } from "../../../utils/Form";
import { EmploymentConnectionValidations } from "../../../validations";
import {
  getEmployerOpportunities,
  getEmploymentConnectionsPickList,
  searchEmployers,
} from "./StudentActions";
import {
  filterAssignedTo,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";
import {
  createLatestAcivity,
  findDifferences,
  findEmployerDifferences,
} from "src/utils/LatestChange/Api";

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

const EnrollmentConnectionForm = (props) => {
  let { onHide, show, student, employmentConnection } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [employerOptions, setEmployerOptions] = useState([]);
  const [allStatusOptions, setAllStatusOptions] = useState([]);
  const [earningTypeOptions, setEarningTypeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [employerOpportunityOptions, setEmployerOpportunityOptions] = useState(
    []
  );
  const [workEngagementOptions, setWorkEngagementOptions] = useState([]);
  const [selectedOpportunityType, setSelectedOpportunityType] = useState(
    props.employmentConnection?.opportunity?.type
  );
  const [selectedStatus, setSelectedStatus] = useState(
    props?.employmentConnection?.status
  );
  const [showEndDate, setShowEndDate] = useState(false);
  const [endDateMandatory, setEndDateMandatory] = useState(false);
  const [rejectionreason, setrejectionreason] = useState([]);
  const [otherrejection, setotherrejection] = useState(false);
  const [showOther, setShowother] = useState(false);
  const [isRejected, setRejected] = useState(false);
  const [ifSelectedOthers, setIfSelectedOthers] = useState(false);

  const userId = localStorage.getItem("user_id");
  let initialValues = {
    employment_connection_student: student.full_name,
    employer_id: "",
    opportunity_id: "",
    status: "",
    start_date: "",
    end_date: "",
    source: "",
    salary_offered: "",
    reason_if_rejected: "",
    reason_if_rejected_other: "",
    assigned_to: userId,
    earning_type: "",
  };

  if (props.employmentConnection) {
    initialValues = { ...initialValues, ...props.employmentConnection };
    initialValues["employer_id"] = props.employmentConnection
      ? Number(props.employmentConnection.opportunity?.employer?.id)
      : null;

    let dataval = rejectionreason?.find(
      (obj) => obj.value === employmentConnection.reason_if_rejected
    );
    if (dataval) {
      if (dataval.value == employmentConnection.reason_if_rejected) {
        initialValues["reason_if_rejected"] =
          employmentConnection.reason_if_rejected;
      }
    }

    initialValues["assigned_to"] = props.employmentConnection?.assigned_to?.id;
    initialValues["opportunity_id"] = props.employmentConnection.opportunity
      ? props.employmentConnection.opportunity.id
      : null;
    initialValues["start_date"] = props.employmentConnection.start_date
    ? props.employmentConnection.start_date.slice(0, 11)
      : null;
    initialValues["end_date"] = props.employmentConnection.end_date
      ? new Date(props.employmentConnection?.end_date)
      : null;
  }

  const onModalClose = () => {
    if (!props.employmentConnection) {
      setEmployerOpportunityOptions([]);
    }
    onHide();
  };

  // Transform obj1 to match obj2 structure
  function transformObj1(obj1) {
    return {
      employment_connection_student: obj1.status, // Assuming status is employment_connection_student
      employer_id: obj1.opportunity?.employer?.id, // Map employer id
      opportunity_id: obj1.opportunity?.id, // Map opportunity id
      status: obj1.status, // Same status
      start_date: obj1.start_date, // Same start date
      end_date: obj1.end_date, // Same end date
      source: obj1.source, // Same source
      salary_offered: obj1.salary_offered, // Same salary
      reason_if_rejected: obj1.reason_if_rejected, // Same rejection reason
      reason_if_rejected_other: obj1.reason_if_rejected_other, // Same other rejection reason
      assigned_to: obj1.assigned_to?.id, // Only id for assigned_to
      id: obj1.id, // Same id
      updated_at: obj1.updated_at, // Same updated_at
      work_engagement: obj1.work_engagement, // Same work engagement
      number_of_internship_hours: obj1.number_of_internship_hours, // Same internship hours
      experience_certificate: obj1.experience_certificate, // Same certificate
      offer_letter: obj1.offer_letter, // Same offer letter
      opportunity: {
        id: obj1.opportunity?.id, // Same opportunity id
        role_description: obj1.opportunity?.role_description, // Same role description
        role_or_designation: obj1.opportunity?.role_or_designation, // Same role or designation
        type: obj1.opportunity?.type, // Same opportunity type
        updated_at: obj1.opportunity?.updated_at, // Same opportunity updated_at
        employer: {
          id: obj1.opportunity?.employer?.id, // Same employer id
          name: obj1.opportunity?.employer?.name, // Same employer name
        },
      },
      employer: obj1.employer, // Same employer name
      status_badge: obj1.status_badge, // Same status badge
      role_or_designation: obj1.role_or_designation, // Same role or designation
      registration_date_formatted: obj1.registration_date_formatted, // Same registration date
      opportunity_type: obj1.opportunity_type, // Same opportunity type
    };
  }

  // The comparison function
  function compareObjects(obj1, obj2) {
    const differences = {};

    // Helper function to handle nested objects comparison
    const compareNested = (key, value1, value2) => {
      // Special handling for 'assigned_to' and 'employer' fields: Compare by 'id'
      if (key === "assigned_to" || key === "employer") {
        if (value1?.id !== value2?.id) {
          differences[key] = { obj1: value1?.id, obj2: value2?.id };
        }
      } else if (
        typeof value1 === "object" &&
        value1 !== null &&
        typeof value2 === "object" &&
        value2 !== null
      ) {
        // For other objects, recurse into them
        const nestedDiffs = compareObjects(value1, value2);
        if (Object.keys(nestedDiffs).length > 0) {
          differences[key] = nestedDiffs;
        }
      } else if (value1 !== value2) {
        // Compare primitive values
        differences[key] = { obj1: value1, obj2: value2 };
      }
    };

    // Iterate over the keys of both objects
    for (const key in obj1) {
      if (key !== "updated_at" && key !== "created_at") {
        // Exclude fields you don't want to compare
        if (obj2.hasOwnProperty(key)) {
          compareNested(key, obj1[key], obj2[key]);
        } else {
          differences[key] = { obj1: obj1[key], obj2: undefined };
        }
      }
    }

    // Check for keys in obj2 that are not in obj1
    for (const key in obj2) {
      if (
        key !== "updated_at" &&
        key !== "created_at" &&
        !obj1.hasOwnProperty(key)
      ) {
        differences[key] = { obj1: undefined, obj2: obj2[key] };
      }
    }

    return differences;
  }

  const onSubmit = async (values) => {
    let propgramEnrollemntData = {};
    if (props.employmentConnection) {
      propgramEnrollemntData = {
        module_name: "Student",
        activity: "Employment Connection Updated",
        event_id: props.student.id,
        updatedby: userId,
        changes_in: findEmployerDifferences(initialValues, values),
      };
    } else {
      propgramEnrollemntData = {
        module_name: "student",
        activity: "Employment Connection Created",
        event_id: props.student.id,
        updatedby: userId,
        changes_in: { name: values.full_name },
      };
    }
    await createLatestAcivity(propgramEnrollemntData);
    if(selectedOpportunityType !== 'Freelance'){
      delete values.earning_type;
  }
  if (selectedOpportunityType !== 'Freelance') {
    values.earning_type = null;   
  }

    onHide(values);
  };

  useEffect(() => {
    setSelectedOpportunityType(props.employmentConnection?.opportunity?.type);
    setSelectedStatus(props.employmentConnection?.status);
  }, [props.employmentConnection]);

  useEffect(() => {
    setShowEndDate(
      selectedStatus === "Internship Complete" ||
      selectedStatus === "Offer Accepted by Student" ||
      selectedOpportunityType === "Apprenticeship"
    );
    setEndDateMandatory(selectedStatus === "Internship Complete");
  }, [selectedStatus, selectedOpportunityType]);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
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
      setEarningTypeOptions(
        data.earning_type.map((item) => ({
          key: item.value,
          value: item.value,
          label: item.value,
        }))
      );
    });

    if (props.employmentConnection) {
      filterEmployer(
        Number(props.employmentConnection?.opportunity?.employer?.name)
      ).then((data) => {
        setEmployerOptions(data);
      });
    }
    if (
      props.employmentConnection &&
      props.employmentConnection.opportunity &&
      props.employmentConnection.opportunity.employer
    ) {
      updateEmployerOpportunityOptions({
        value: Number(props.employmentConnection.opportunity.employer.id),
      });
    }
  }, [props]);

  useEffect(() => {
    let filteredOptions = allStatusOptions;
    if (
      selectedOpportunityType === "Job" ||
      selectedOpportunityType === "Internship" ||
      selectedOpportunityType === "UnPaid GIG" ||
      selectedOpportunityType === "Paid GIG" ||
      selectedOpportunityType === "Apprenticeship" ||
      selectedOpportunityType === "Freelance"
    ) {
      filteredOptions = allStatusOptions.filter(
        (item) =>
          item["applicable-to"].includes(selectedOpportunityType) ||
          item["applicable-to"] === "Both"
      );
      
    }
    
    // if(selectedOpportunityType === 'Apprenticeship'){
    //   filteredOptions = allStatusOptions.filter(item=> item['applicable-to'].includes(selectedOpportunityType) || item['applicable-to'] === 'Apprenticeship');
    // }
    else {
      filteredOptions = allStatusOptions.filter(
        (item) => item["applicable-to"] === "Both"
      );
    }
    // setStatusOptions(filteredOptions);

    setStatusOptions(
      filteredOptions.map((item) => {
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
  }, [selectedOpportunityType, allStatusOptions]);

  const updateEmployerOpportunityOptions = (employer) => {
    setEmployerOpportunityOptions([]);

    getEmployerOpportunities(Number(employer.value)).then((data) => {
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

  const filterEmployer = async (filterValue) => {
    try {
      const employerData = await searchEmployers(filterValue);

      let employmentConnectionEmployer = props.employmentConnection
        ? props.employmentConnection.opportunity?.employer
        : null;
      let employerFoundInList = false;

      let filterData = employerData.data.employersConnection.values.map(
        (employer) => {
          if (
            props.employmentConnection &&
            employer.id === Number(employmentConnectionEmployer?.id)
          ) {
            employerFoundInList = true;
          }
          return {
            ...employer,
            label: employer.name,
            value: Number(employer.id),
          };
        }
      );
      if (
        props.employmentConnection &&
        employmentConnectionEmployer !== null &&
        !employerFoundInList
      ) {
        filterData.unshift({
          label: employmentConnectionEmployer?.name,
          value: Number(employmentConnectionEmployer?.id),
        });
      }
      return filterData;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (initialValues.reason_if_rejected in rejectionreason) {
      setShowother(true);
    }
  }, []);

  const handleStatusChange = async (value) => {
    setSelectedStatus(value);
    if (value === "Rejected by Employer") {
      setRejected(true);
    } else if (value === "Student Dropped Out") {
      setRejected(true);
    } else if (value === "Rejected by Student") {
      setRejected(true);
    } else {
      setRejected(false);
    }
  };

  useEffect(() => {
    setotherrejection(false);
  }, [employmentConnection]);
console.log(statusOptions,'statusOptions')
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
            {props.employmentConnection && props.employmentConnection.id
              ? "Update "
              : "Add New "}
            Employment Connection
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={EmploymentConnectionValidations} 
          validate={(values) => {
            const errors = {};
        
            // Require earning_type only when the chosen opportunity TYPE is Freelance
            if (selectedOpportunityType === 'Freelance' && !values.earning_type) {
              errors.earning_type = 'Earning type is required when type is Freelance.';
            }
        
            return errors;
          }}
        
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Section>
                <div className="row form_sec">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="employment_connection_student"
                      control="input"
                      label="Student"
                      className="form-control"
                      placeholder="Student"
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {assigneeOptions.length ? (
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
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      control="lookupAsync"
                      name="employer_id"
                      label="Employer"
                      required
                      filterData={filterEmployer}
                      defaultOptions={
                        props.employmentConnection?.id ? employerOptions : true
                      }
                      className="form-control"
                      placeholder="Employer"
                      onChange={(employer) => {
                        setSelectedOpportunityType(null);
                        setFieldValue('opportunity_id', '');
                        updateEmployerOpportunityOptions(employer);
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
                        required
                        options={employerOpportunityOptions}
                        className="form-control"
                        placeholder={"Opportunity"}
                        onChange={(e) => setSelectedOpportunityType(e.type)}
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

                  {selectedOpportunityType === "Freelance" && (
                    <div className="col-md-6 col-sm-12 mt-2">
                      <Input
                        icon="down"
                        control="lookup"
                        name="earning_type"
                        label="Earning Type"
                        options={earningTypeOptions}
                        className="form-control"
                        placeholder="Earning Type"
                        required
                      />
                    </div>
                  )}
                  
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="status"
                      label="Status"
                      required
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
                      required
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
                      label="Monthly Salary"
                      required
                      className="form-control"
                      placeholder="Monthly Salary"
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
                        required={endDateMandatory}
                      />
                    </div>
                  )}
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="source"
                      label="Source"
                      required
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
                        required={
                          selectedStatus === "Rejected by Student"
                        }
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
                        required
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
                      required
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
                        required
                        placeholder="Number of Internship hours"
                      />
                    </div>
                  )}
                </div>
                 
              </Section>

              <div className="row justify-content-end mt-5">
                <div className="col-auto p-0">
                  <button
                    type="button"
                    onClick={onModalClose}
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
      </Modal.Body>
    </Modal>
  );
};

export default EnrollmentConnectionForm;