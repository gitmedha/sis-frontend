import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { MeiliSearch } from 'meilisearch'

import { Input } from "../../../utils/Form";
import { ProgramEnrollmentValidations } from "../../../validations/Institute";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
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

const meilisearchClient = new MeiliSearch({
  host: process.env.REACT_APP_MEILISEARCH_HOST_URL,
  apiKey: process.env.REACT_APP_MEILISEARCH_API_KEY,
});

const ProgramEnrollmentForm = (props) => {
  let { onHide, show, institution } = props;
  const [loading, setLoading] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState([]);
  const [feeStatusOptions, setFeeStatusOptions] = useState([]);
  const [yearOfCompletionOptions, setYearOfCompletionOptions] = useState([]);
  const [currentCourseYearOptions, setCurrentCourseYearOptions] = useState([]);
  const [courseLevelOptions, setCourseLevelOptions] = useState([]);
  const [courseTypeOptions, setCourseTypeOptions] = useState([]);
  const [requiresFee, setRequiresFee] = useState(true); // Not free by default.
  const [lookUpLoading, setLookUpLoading] = useState(false);
  const [options, setOptions] = useState(null);

  const prepareLookUpFields = async () => {
    setLookUpLoading(true);
    let lookUpOpts = await batchLookUpOptions();
    setOptions(lookUpOpts);
    setLookUpLoading(false);
  };

  useEffect(() => {
    if ( props.batch) {
      filterBatch(props.programEnrollment.batch.name).then(data => {
        setBatchOptions(data);
      });
    }

    if ( props.student) {
      filterStudent(props.programEnrollment.student.full_name).then(data => {
        setStudentOptions(data);
      });
    }
  }, [props])

  useEffect(() => {
    if (show && !options) {
      prepareLookUpFields();
    }
  }, [show, options]);

  useEffect(() => {
    setRequiresFee(props?.programEnrollment?.fee_status?.toLowerCase() !=='free')
  }, [props.programEnrollment]);

  let initialValues = {
    program_enrollment_institution: institution?.name,
    student:'',
    status: '',
    batch: '',
    registration_date: '',
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
    discount_code_id:'',
    fee_amount: null,
  };
  if (props.programEnrollment) {
    initialValues = {...initialValues, ...props.programEnrollment};
    initialValues['batch'] = Number(props.programEnrollment.batch?.id);
    initialValues['student'] = Number(props.programEnrollment.student?.id);
    initialValues['registration_date'] = props.programEnrollment.registration_date ? new Date(props.programEnrollment.registration_date) : null;
    initialValues['certification_date'] = props.programEnrollment.certification_date ? new Date(props.programEnrollment.certification_date) : null;
    initialValues['fee_payment_date'] = props.programEnrollment.fee_payment_date ? new Date(props.programEnrollment.fee_payment_date) : null;
    initialValues['fee_refund_date'] = props.programEnrollment.fee_refund_date ? new Date(props.programEnrollment.fee_refund_date) : null;
  }

  const onSubmit = async (values) => {
    onHide(values);
  };

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setStatusOptions(data.status.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setFeeStatusOptions(data.fee_status.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setYearOfCompletionOptions(data.year_of_completion.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCurrentCourseYearOptions(data.current_course_year.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCourseLevelOptions(data.course_level.map(item => ({ key: item.value, value: item.value, label: item.value })));
      setCourseTypeOptions(data.course_type.map(item => ({ key: item.value, value: item.value, label: item.value })));
    });
  }, []);


  const filterStudent = async (filterValue) => {
    return await meilisearchClient.index('students').search(filterValue, {
      limit: 100,
      attributesToRetrieve: ['id', 'full_name', 'student_id']
    }).then(data => {
      let programEnrollmentStudent = props.programEnrollment ? props.programEnrollment.student : null;
      let studentFoundInList = false;
      let filterData = data.hits.map(student => {
        if (props.programEnrollment && student.id === Number(programEnrollmentStudent?.id)) {
          studentFoundInList = true;
        }
        return {
          ...student,
          label: `${student.full_name} (${student.student_id})`,
          value: Number(student.id),
        }
      });
      if (props.programEnrollment && programEnrollmentStudent !== null && !studentFoundInList) {
        filterData.unshift({
          label: programEnrollmentStudent.full_name,
          value: Number(programEnrollmentStudent.id),
        });
      }
      return filterData;
    });
  }

  const filterBatch = async (filterValue) => {
    return await meilisearchClient.index('batches').search(filterValue, {
      limit: 100,
      attributesToRetrieve: ['id', 'name']
    }).then(data => {
      let batchFoundInList = false;
      let programEnrollmentBatch = props.programEnrollment ? props.programEnrollment.batch : null;
      let filterData = data.hits.map(batch => {
        if (props.programEnrollment && batch.id === Number(programEnrollmentBatch?.id)) {
          batchFoundInList = true;
        }
        return {
          ...batch,
          label: batch.name,
          value: Number(batch.id),
        }
      });
      if (props.programEnrollment && programEnrollmentBatch !== null && !batchFoundInList) {
        filterData.unshift({
          label: programEnrollmentBatch.name,
          value: Number(programEnrollmentBatch.id),
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
                <h3 className="section-header">Enrollment Details</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                  {!lookUpLoading ? (
                    <Input
                      name="student"
                      control="lookupAsync"
                      label="Student"
                      className="form-control"
                      placeholder="Student"
                      filterData={filterStudent}
                      defaultOptions={props.id ? studentOptions : true}
                      required
                    />
                     ) : (
                      <Skeleton count={1} height={60} />
                    )}
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="status"
                      label="Program Status"
                      required
                      options={statusOptions}
                      className="form-control"
                      placeholder="Program Status"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                  {!lookUpLoading ? (
                    <Input
                      control="lookupAsync"
                      name="batch"
                      label="Batch"
                      required
                      filterData={filterBatch}
                      defaultOptions={props.id ? batchOptions : true}
                      className="form-control"
                      placeholder="Batch"
                    />
                     ) : (
                      <Skeleton count={1} height={60} />
                    )}
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
                      control="input"
                      name="program_enrollment_institution"
                      label="Institution"
                      className="form-control"
                      placeholder="Institution"
                      disabled={true}
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
                <h3 className="section-header">Higher Education</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="higher_education_course_name"
                      control="input"
                      label="Course Name"
                      className="form-control"
                      placeholder="Course Name"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      icon="down"
                      control="lookup"
                      name="higher_education_year_of_course_completion"
                      label="Year of Passing"
                      options={yearOfCompletionOptions}
                      className="form-control"
                      placeholder="Year of Passing"
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
                      onChange = {(e) => setRequiresFee(e.value.toLowerCase() !== 'waived off')}
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
                      disabled={!requiresFee}
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
                      disabled={!requiresFee}
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
                      disabled={!requiresFee}
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
                      disabled={!requiresFee}
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

export default ProgramEnrollmentForm;
