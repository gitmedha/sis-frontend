import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";

import { Input } from "../../../utils/Form";
import { BatchValidations } from "../../../validations";
import { getBatchesPickList } from "../batchActions";
import { batchLookUpOptions } from "../../../utils/function/lookupOptions";

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

const BatchForm = (props) => {
  let { onHide, show } = props;
  const [lookUpLoading, setLookUpLoading] = useState(false);
  const [options, setOptions] = useState(null);

  let initialValues = {
    name: '',
    name_in_current_sis: '',
    assigned_to: '',
    program: '',
    grant: '',
    institution: '',
    status: '',
    number_of_sessions_planned: '',
    per_student_fees: '',
    seats_available: '',
    start_date: '',
    end_date: '',
  };
  if (props.id) {
    initialValues = {...props}
    initialValues['grant'] = Number(props.grant.id);
    initialValues['program'] = Number(props.program.id);
    initialValues['institution'] = Number(props.institution.id);
    initialValues['assigned_to'] = Number(props.assigned_to.id);
    initialValues['start_date'] = new Date(props.start_date);
    initialValues['end_date'] = new Date(props.end_date);
  }


  const prepareLookUpFields = async () => {
    setLookUpLoading(true);
    let lookUpOpts = await batchLookUpOptions();
    setOptions(lookUpOpts);
    setLookUpLoading(false);
  };

  useEffect(() => {
    getBatchesPickList();
  }, []);

  useEffect(() => {
    if (show && !options) {
      prepareLookUpFields();
    }
  }, [show, options]);

  const onSubmit = async (values) => {
    onHide(values);
  };

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
            {props.id ? props.name : 'Add New Batch'}
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={BatchValidations}
        >
          {({ values }) => (
            <Form>
              <Section>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="name"
                      label="Name"
                      required
                      control="input"
                      placeholder="Name"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      control="input"
                      className="form-control"
                      name="name_in_current_sis"
                      label="Name in Current SIS"
                      required
                      placeholder="Name in Current SIS"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {!lookUpLoading ? (
                      <Input
                        control="lookup"
                        name="assigned_to"
                        label="Assigned To"
                        required
                        className="form-control"
                        placeholder="Assigned To"
                        options={options?.assigneesOptions}
                      />
                    ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {!lookUpLoading ? (
                      <Input
                        name="program"
                        label="Program"
                        required
                        control="lookup"
                        placeholder="Program"
                        className="form-control"
                        options={options?.programOptions}
                      />
                    ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {!lookUpLoading ? (
                      <Input
                        name="grant"
                        label="Grant"
                        required
                        control="lookup"
                        placeholder="Grant"
                        className="form-control"
                        options={options?.grantOptions}
                      />
                    ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {!lookUpLoading ? (
                      <Input
                        control="lookup"
                        name="institution"
                        label="Institution"
                        required
                        placeholder="Institution"
                        className="form-control"
                        options={options?.instituteOptions}
                      />
                    ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    {!lookUpLoading ? (
                      <Input
                        icon="down"
                        name="status"
                        label="Status"
                        required
                        control="lookup"
                        placeholder="Status"
                        className="form-control"
                        options={options?.statusOptions}
                      />
                    ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>

                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      min={0}
                      type="number"
                      control="input"
                      className="form-control"
                      name="number_of_sessions_planned"
                      label="Number of sessions planned"
                      required
                      placeholder="Number of sessions planned"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      min={0}
                      type="number"
                      control="input"
                      name="per_student_fees"
                      className="form-control"
                      label="Per Student Fees"
                      required
                      placeholder="Per Student Fees"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      min={0}
                      type="number"
                      control="input"
                      name="seats_available"
                      className="form-control"
                      label="Seats Available"
                      required
                      placeholder="Seats Available"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="start_date"
                      label="Start Date"
                      required
                      control="datepicker"
                      className="form-control"
                      placeholder="Start Date"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="end_date"
                      label="End Date"
                      required
                      control="datepicker"
                      placeholder="End Date"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </Section>
              <div className="row mt-3 py-3">
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={onHide}
                    className="btn btn-secondary btn-regular mr-2"
                  >
                    CLOSE
                  </button>
                  <div style={{ width: "20px" }} />
                  <button className="btn btn-primary btn-regular" type="submit">SAVE</button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default BatchForm;
