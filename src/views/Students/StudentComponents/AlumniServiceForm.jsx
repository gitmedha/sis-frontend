import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { MeiliSearch } from 'meilisearch'

import { Input } from "../../../utils/Form";
import { AlumniServiceValidations } from "../../../validations/Student";
import { getStudentsPickList } from "./StudentActions";
import { batchLookUpOptions } from "../../../utils/function/lookupOptions";
import Textarea from '../../../utils/Form/Textarea';
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

const AlumniServiceForm = (props) => {
  let { onHide, show } = props;
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [lookUpLoading, setLookUpLoading] = useState(false);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    getDefaultAssigneeOptions().then(data => {
      setAssigneeOptions(data);
    });

    getStudentsPickList().then((data) => {
      setTypeOptions(data.alumni_service_type.map((item) => ({ key: item.value, value: item.value, label: item.value })));
      setLocationOptions( data.alumni_service_location.map((item) => ({ key: item.value, value: item.value, label: item.value })));
    });
  }, []);

  let initialValues = {
    alumni_service_student: props.student.full_name,
    type:'',
    location:'',
    receipt_number:'',
    fee_amount:'',
    comments:'',
    start_date: null,
    end_date: null,
    fee_submission_date: null,
  };

  if (props.alumniService) {
    initialValues = {...initialValues, ...props.alumniService};
    initialValues['assigned_to'] = props.alumniService?.assigned_to?.id;
    initialValues['start_date'] = props.alumniService.start_date ? new Date(props.alumniService.start_date) : null;
    initialValues['end_date'] = props.alumniService.end_date ? new Date(props.alumniService.end_date) : null;
    initialValues['fee_submission_date'] = props.alumniService.fee_submission_date ? new Date(props.alumniService.fee_submission_date) : null;
  }

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
            {props.alumniService && props.alumniService.id ? 'Update' : 'Add New'} Alumni Service
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={AlumniServiceValidations}
        >
          {({ values }) => (
            <Form>
              <Section>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="alumni_service_student"
                      control="input"
                      label="Student"
                      className="form-control"
                      placeholder="Student"
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
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
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="type"
                      label="Type"
                      options={typeOptions}
                      className="form-control"
                      placeholder="Type"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="location"
                      label="Location"
                      options={typeOptions}
                      className="form-control"
                      placeholder="Location"
                      required
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
                      required
                    />
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
                    <Input
                      name="fee_submission_date"
                      label="Fee Submission Date"
                      placeholder="Fee Submission Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="fee_amount"
                      label="Fee Amount"
                      placeholder="Fee Amount"
                      control="input"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="receipt_number"
                      label="Receipt Number"
                      placeholder="Receipt Number"
                      control="input"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-12 col-sm-12 mt-2">
                    <Textarea
                      name="comments"
                      label="Comments"
                      placeholder="Comments"
                      control="input"
                      className="form-control"
                      autoComplete="off"
                    ></Textarea>
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

export default AlumniServiceForm;
