import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";

import { Input } from "../../../utils/Form";
import { ProgramEnrollmentValidations } from "../../../validations";
import { getAllBatches, getAllInstitutions, getStudentsPickList } from "./StudentActions";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";

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

const ProgramEnrollmentForm = (props) => {
  let { onHide, show, student } = props;
  const [loading, setLoading] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [feeStatusOptions, setFeeStatusOptions] = useState([]);
  const [yearOfCompletionOptions, setYearOfCompletionOptions] = useState([]);
  const [currentCourseYearOptions, setCurrentCourseYearOptions] = useState([]);
  const [courseLevelOptions, setCourseLevelOptions] = useState([]);
  const [courseTypeOptions, setCourseTypeOptions] = useState([]);

  let initialValues = {
    program_enrollment_student: student.first_name + ' ' + student.last_name,
    status: '',
    batch: '',
    registration_date: '',
    institution: '',
    certification_date: '',
    fee_payment_date: '',
    fee_refund_date: '',
    course_name_in_current_sis: '',
    fee_transaction_id: '',
    course_type:'',
    course_level:'',
    course_year:'',
    year_of_course_completion:'',
    fee_status:'',
    certification_date: null,
    fee_payment_date: null,
    fee_refund_date: null,
  };
  if (props.programEnrollment) {
    initialValues = {...initialValues, ...props.programEnrollment};
    initialValues['batch'] = props.programEnrollment.batch?.id;
    initialValues['institution'] = props.programEnrollment.institution?.id;
    initialValues['registration_date'] = props.programEnrollment.registration_date ? new Date(props.programEnrollment.registration_date) : null;
    initialValues['certification_date'] = props.programEnrollment.certification_date ? new Date(props.programEnrollment.certification_date) : null;
    initialValues['fee_payment_date'] = props.programEnrollment.fee_payment_date ? new Date(props.programEnrollment.fee_payment_date) : null;
    initialValues['fee_refund_date'] = props.programEnrollment.fee_refund_date ? new Date(props.programEnrollment.fee_refund_date) : null;
  }

  const onSubmit = async (values) => {
    onHide(values);
  };

  useEffect(() => {
    getAllBatches().then(data => {
      setBatchOptions(data?.data?.data?.batches.map((batches) => ({
        key: batches.name,
        label: batches.name,
        value: batches.id,
      })));
    });

    getAllInstitutions().then(data => {
      setInstitutionOptions(data?.data?.data?.institutions.map((institution) => ({
        key: institution.name,
        label: institution.name,
        value: institution.id,
      })));
    });

    getProgramEnrollmentsPickList().then(data => {
      setStatusOptions(data.status.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setFeeStatusOptions(data.fee_status.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setYearOfCompletionOptions(data.year_of_completion.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCurrentCourseYearOptions(data.current_course_year.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCourseLevelOptions(data.course_level.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCourseTypeOptions(data.course_type.map(item => ({ key: item.value, value: item.value, label: item.value })));
    });
  }, []);

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
            {props.programEnrollment && props.programEnrollment.id ? 'Update' : 'Add New'} Program Enrollment
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={ProgramEnrollmentValidations}
        >
          {({ values }) => (
            <Form>
              <Section>
                <h3 className="section-header">Details</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="program_enrollment_student"
                      control="input"
                      label="Student"
                      className="form-control"
                      placeholder="Student"
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
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      control="lookup"
                      name="batch"
                      label="Batch"
                      required
                      options={batchOptions}
                      className="form-control"
                      placeholder="Batch"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="registration_date"
                      label="Registration Date"
                      required
                      placeholder="Registration Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      control="lookup"
                      name="institution"
                      label="Institution"
                      required
                      options={institutionOptions}
                      className="form-control"
                      placeholder="Institution"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="certification_date"
                      label="Certification Date"
                      placeholder="Certification Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </Section>
              <Section>
                <h3 className="section-header">Course Details</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="course_level"
                      label="Course Level"
                      required
                      options={courseLevelOptions}
                      className="form-control"
                      placeholder="Course Level"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="year_of_course_completion"
                      label="Year of Completion"
                      required
                      options={yearOfCompletionOptions}
                      className="form-control"
                      placeholder="Year of Completion"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="course_type"
                      label="Course Type"
                      required
                      options={courseTypeOptions}
                      className="form-control"
                      placeholder="Course Type"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="program_enrollment_id"
                      control="input"
                      label="Program Enrollment ID"
                      className="form-control"
                      placeholder="To be decided"
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="course_year"
                      label="Current Course Year"
                      required
                      options={currentCourseYearOptions}
                      className="form-control"
                      placeholder="Current Course Year"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="course_name_in_current_sis"
                      control="input"
                      label="Course Name"
                      required
                      className="form-control"
                      placeholder="Course Name"
                    />
                  </div>
                </div>
              </Section>
              <Section>
                <h3 className="section-header">Fee Details</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="fee_status"
                      label="Fees Status"
                      required
                      options={feeStatusOptions}
                      className="form-control"
                      placeholder="Fees Status"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="fee_payment_date"
                      label="Fee Payment Date"
                      placeholder="Fee Payment Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="discount_code_id"
                      control="input"
                      label="Discount Code ID"
                      className="form-control"
                      placeholder="Discount Code ID"
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="fee_transaction_id"
                      control="input"
                      label="Fee Transaction ID / Receipt No."
                      className="form-control"
                      placeholder="Fee Transaction ID / Receipt No."
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      min={0}
                      type="number"
                      name="fee_amount"
                      control="input"
                      label="Fee Amount (INR)"
                      className="form-control"
                      placeholder="Fee Amount"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="fee_refund_date"
                      label="Fee Refund Date"
                      placeholder="Date"
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
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
                      onClick={onHide}
                      className="btn btn-secondary btn-regular mr-2"
                    >
                      CLOSE
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

export default ProgramEnrollmentForm;
