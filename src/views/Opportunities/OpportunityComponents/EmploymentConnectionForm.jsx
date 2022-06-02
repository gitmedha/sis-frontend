import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { MeiliSearch } from 'meilisearch';

import { Input } from "../../../utils/Form";
import { OpportunityEmploymentConnectionValidations } from "../../../validations";
import { getAllEmployers, getEmployerOpportunities, getEmploymentConnectionsPickList } from '../../Students/StudentComponents/StudentActions';
import { filterAssignedTo, getDefaultAssigneeOptions } from '../../../utils/function/lookupOptions';

const Section = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;

  &:not(:first-child) {
    border-top: 1px solid #C4C4C4;
  }

  .section-header {
    color: #207B69;
    font-family: 'Latto-Regular';
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


const EnrollmentConnectionForm = (props) => {
  let { onHide, show, opportunity } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [showEndDate, setShowEndDate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(props.employmentConnection ? props.employmentConnection.status : null);
  const [selectedOpportunityType, setSelectedOpportunityType] = useState(props.opportunity.type);

  let initialValues = {
    student: '',
    employer_name: opportunity.employer.name,
    opportunity_name: opportunity.role_or_designation,
    status: '',
    start_date:'',
    end_date:'',
    source:'',
    salary_offered:'',
  };

  if (props.employmentConnection) {
    initialValues = {...initialValues, ...props.employmentConnection};
    initialValues['student_id'] = props.employmentConnection.student ? Number(props.employmentConnection.student.id) : null;
    initialValues['assigned_to'] = props.employmentConnection?.assigned_to?.id;
    initialValues['employer_name'] = props.employmentConnection.opportunity && props.employmentConnection.opportunity.employer ? props.employmentConnection.opportunity.employer.name : null;
    initialValues['opportunity_name'] = props.employmentConnection.opportunity ? props.employmentConnection.opportunity.role_or_designation : null;
    initialValues['start_date'] = props.employmentConnection.start_date ? new Date(props.employmentConnection.start_date) : null;
    initialValues['end_date'] = props.employmentConnection.end_date ? new Date(props.employmentConnection.end_date) : null;
  }

  useEffect(() => {
    setShowEndDate(selectedOpportunityType && selectedOpportunityType.toLowerCase() === 'internship');
  }, [selectedOpportunityType]);

  const onModalClose = () => {
    onHide();
  }

  const onSubmit = async (values) => {
    onHide(values);
  };

  useEffect(() => {
    getEmploymentConnectionsPickList().then(data => {
      setStatusOptions(data.status.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setSourceOptions(data.source.map(item => ({ key: item.value, value: item.value, label: item.value })));
    });
    if (props.employmentConnection && props.employmentConnection.student) {
      filterStudent(props.employmentConnection.student.name).then(data => {
        setStudentOptions(data);
      });
    }
  }, [props]);

  useEffect(() => {
    getDefaultAssigneeOptions().then(data => {
      setAssigneeOptions(data);
    });
  }, []);

  const filterStudent = async (filterValue) => {
    return await meilisearchClient.index('students').search(filterValue, {
      limit: 100,
      attributesToRetrieve: ['id', 'full_name', 'student_id']
    }).then(data => {
      let employmentConnectionStudent = props.employmentConnection ? props.employmentConnection.student : null;
      let studentFoundInEmploymentList = false;
      let filterData = data.hits.map(student => {
        if (props.employmentConnection && student.id === Number(employmentConnectionStudent?.id)) {
          studentFoundInEmploymentList = true;
        }
        return {
          ...student,
          label: `${student.full_name} (${student.student_id})`,
          value: Number(student.id),
        }
      });
      if (props.employmentConnection && employmentConnectionStudent !== null && !studentFoundInEmploymentList) {
        filterData.unshift({
          label: employmentConnectionStudent.full_name,
          value: Number(employmentConnectionStudent.id),
        });
      }
      return filterData;
    });
  }

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
            {props.employmentConnection && props.employmentConnection.id ? 'Update' : 'Add New'} Employment Connection
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={OpportunityEmploymentConnectionValidations}
        >
          {({ setFieldValue }) => (
            <Form>
              <Section>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="student_id"
                      control="lookupAsync"
                      label="Student"
                      className="form-control"
                      placeholder="Student"
                      filterData={filterStudent}
                      defaultOptions={props.employmentConnection ? studentOptions : true}
                      required={true}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {/* {statusOptions.length ? ( */}
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
                    {/* ) : ( */}
                      {/* <Skeleton count={1} height={45} /> */}
                    {/* )} */}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      control="input"
                      name="employer_name"
                      label="Employer"
                      className="form-control"
                      placeholder="Employer"
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      control="input"
                      name="opportunity_name"
                      label="Opportunity"
                      className="form-control"
                      placeholder={'Opportunity'}
                      disabled={true}
                    />
                  </div>
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
                      onChange = {(e) => setSelectedStatus(e.value)}
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
                      label="Salary Offered"
                      required
                      className="form-control"
                      placeholder="Salary Offered"
                    />
                  </div>
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
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="reason_if_rejected"
                      control="input"
                      label="Reason if Rejected"
                      className="form-control"
                      placeholder="Reason if Rejected"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                  {showEndDate &&
                    <Input
                      name="end_date"
                      label="End Date"
                      placeholder="End Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  }
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="certificate"
                      control="input"
                      label="Upload Internship Certificate"
                      className="form-control"
                      placeholder="Upload Internship Certificate"
                      disabled={true}
                    />
                  </div>
                </div>
              </Section>
              <div className="row mt-3 py-3">
                <div className="d-flex justify-content-start">
                    <button className="btn btn-primary btn-regular mx-0" type="submit">
                      SAVE
                    </button>
                    <button
                      type="button"
                      onClick={onModalClose}
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
  );
};

export default EnrollmentConnectionForm;
