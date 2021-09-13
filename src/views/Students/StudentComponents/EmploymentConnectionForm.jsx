import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import Skeleton from "react-loading-skeleton";

import { Input } from "../../../utils/Form";
import { EmploymentConnectionValidations } from "../../../validations";
import { getAllEmployers, getEmployerOpportunities, getEmploymentConnectionsPickList } from "./StudentActions";

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

const EnrollmentConnectionForm = (props) => {
  let { onHide, show, student } = props;
  const [loading, setLoading] = useState(false);
  const [employerOptions, setEmployerOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [employerOpportunityOptions, setEmployerOpportunityOptions] = useState([]);

  let initialValues = {
    employment_connection_student: student.first_name + ' ' + student.last_name,
    employer_id:'',
    opportunity_id:'',
    status: '',
    start_date:'',
    end_date:'',
    source:'',
    salary_offered:'',
  };
  if (props.employmentConnection) {
    initialValues = {...initialValues, ...props.employmentConnection};
    initialValues['employer_id'] = props.employmentConnection.opportunity ? props.employmentConnection.opportunity.employer.id : null;
    initialValues['opportunity_id'] = props.employmentConnection.opportunity ? props.employmentConnection.opportunity.id : null;
    initialValues['start_date'] = props.employmentConnection.start_date ? new Date(props.employmentConnection.start_date) : null;
    initialValues['end_date'] = props.employmentConnection.end_date ? new Date(props.employmentConnection.end_date) : null;
  }

  const onModalClose = () => {
    if (!props.employmentConnection) {
      setEmployerOpportunityOptions([]);
    }
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
    getAllEmployers().then(data => {
      setEmployerOptions(data?.data?.data?.employers.map((employer) => ({
        key: employer.name,
        label: employer.name,
        value: employer.id,
      })));
      if (props.employmentConnection && props.employmentConnection.opportunity) {
        updateEmployerOpportunityOptions({
          value: Number(props.employmentConnection.opportunity.employer.id),
        });
      }
    });
  }, [props]);


  const updateEmployerOpportunityOptions = employer => {
    setEmployerOpportunityOptions([]);
    getEmployerOpportunities(Number(employer.value)).then(data => {
      setEmployerOpportunityOptions(data?.data?.data?.opportunities.map((opportunity) => ({
        key: opportunity.role_or_designation,
        label: opportunity.role_or_designation,
        value: opportunity.id,
      })));
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
            {props.employmentConnection && props.employmentConnection.id ? 'Update' : 'Add New'} Employment Connection Enrollment
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={EmploymentConnectionValidations}
        >
          {({ setFieldValue }) => (
            <Form>
              <Section>
                <div className="row">
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
                    {employerOptions.length ? (
                      <Input
                        icon="down"
                        control="lookup"
                        name="employer_id"
                        label="Employer"
                        options={employerOptions}
                        className="form-control"
                        placeholder="Employer"
                        onChange={updateEmployerOpportunityOptions}
                      />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="end_date"
                      label="End Date"
                      placeholder="End Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
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
                        placeholder={'Opportunity'}
                      />
                    ) : (
                      <>
                        <label className="text-heading" style={{color: '#787B96'}}>Opportunity (select an employer first)</label>
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
                    <Input
                      min={0}
                      type="number"
                      name="salary_offered"
                      control="input"
                      label="Salary Offered"
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
                      options={sourceOptions}
                      className="form-control"
                      placeholder="Source"
                    />
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
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={onModalClose}
                    className="btn btn-secondary btn-regular mr-2"
                  >
                    CLOSE
                  </button>
                  <div style={{ width: "20px" }} />
                  <button className="btn btn-primary btn-regular" type="submit">
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
