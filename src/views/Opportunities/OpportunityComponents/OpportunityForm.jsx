import { Formik, FieldArray, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
// import { EmployerValidations } from "../../../validations";
import  {getOpportunitiesPickList, getAssigneeOptions} from "./opportunityAction"
import { getAllEmployers } from '../../Students/StudentComponents/StudentActions';

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

const OpportunityForm = (props) => {
  let { onHide, show } = props;
  const [statusOptions, setStatusOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [compensationTypeOptions, setCompensationTypeOptions] = useState([]);
  const [employerOptions, setEmployerOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);

  useEffect(() => {
    getOpportunitiesPickList().then(data => {
      setStatusOptions(data.status.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value.toLowerCase(),
        };
      }));

      setTypeOptions(data.type.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value.toLowerCase(),
        };
      }));

      setCompensationTypeOptions(data.paid.map((item) => {
        return {
          key: item.value,
          label: item.value,
          value: item.value.toLowerCase(),
        };
      }));
    });

    getAssigneeOptions().then(data => {
      setAssigneeOptions(data?.data?.data?.users.map((assignee) => ({
          key: assignee.username,
          label: assignee.username,
          value: assignee.id,
      })));
    });

    getAllEmployers().then(data => {
      setEmployerOptions(data?.data?.data?.employers.map((employer) => ({
        key: employer.name,
        label: employer.name,
        value: Number(employer.id),
      })));
    });

  }, []);

  const onSubmit = async (values) => {
    onHide(values);
  };

  let initialValues = {...props};
  initialValues['assigned_to'] = props?.assigned_to?.id;
  initialValues['employer'] = props.employer ? Number(props.employer.id) : '';

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
            {props.id ? props.role_or_designation : 'Add New Opportunity'}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
         onSubmit={onSubmit}
         initialValues={initialValues}
        //  validationSchema={EmployerValidations}
        >
          {({ values }) => (
            <Form>
              <Section>
                <h3 className="section-header">Details</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="employer"
                      control="lookup"
                      label="Employer"
                      placeholder="Employer"
                      className="form-control"
                      options={employerOptions}
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="role_or_designation"
                      label="Role/Designation"
                      control="input"
                      placeholder="Role/Designation"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="type"
                      label="Type"
                      control="lookup"
                      placeholder="Type"
                      options={typeOptions}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="number_of_opportunities"
                      type="number"
                      control="input"
                      label="No. of opportunities"
                      placeholder="No. of opportunities"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    {assigneeOptions.length ? (
                      <Input
                        control="lookup"
                        name="assigned_to"
                        label="Assigned To"
                        options={assigneeOptions}
                        className="form-control"
                        placeholder="Assigned To"
                        required
                      />
                    ) : (
                      <Skeleton count={1} height={45} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="status"
                      label="Status"
                      control="lookup"
                      options={statusOptions}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="department_or_team"
                      control="input"
                      label="Department/Team"
                      placeholder="Department/Team"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="salary"
                      type="number"
                      control="input"
                      label="Salary"
                      placeholder="Salary"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="compensation_type"
                      control="lookup"
                      label="Paid"
                      placeholder="Paid"
                      options={compensationTypeOptions}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="skills_required"
                      control="input"
                      label="Skills Required"
                      placeholder="Skills Required"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-sm-12 mb-2">
                    <Input
                      name="role_description"
                      control="textarea"
                      label="Description"
                      placeholder="Description"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </Section>
              <div className="row mt-3 py-3">
                <div className="d-flex justify-content-start">
                <button className="btn btn-primary btn-regular mx-0" type="submit">SAVE</button>
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
  );
};

export default OpportunityForm;
