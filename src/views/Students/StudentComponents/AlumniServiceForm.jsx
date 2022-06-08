import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { MeiliSearch } from 'meilisearch'

import { Input } from "../../../utils/Form";
import { AlumniServiceValidations } from "../../../validations/Student";
import { getAllBatches } from "../../Batches/batchActions";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import { batchLookUpOptions } from "../../../utils/function/lookupOptions";
import Textarea from '../../../utils/Form/Textarea';

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

const AlumniServiceForm = (props) => {
  let { onHide, show, batch } = props;
  const [loading, setLoading] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [institutionOptions, setInstitutionOptions] = useState(null);
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
    // if (props.institution) {
    //   filterInstitution(props.programEnrollment.institution.name).then(data => {
    //     setInstitutionOptions(data);
    //   });
    // }

    // if (props.student) {
    //   filterStudent(props.programEnrollment.student.full_name).then(data => {
    //     setStudentOptions(data);
    //   });
    // }
  }, [props]);

  useEffect(() => {
    if (show && !options) {
      // prepareLookUpFields();
    }
  }, [show, options]);

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
    initialValues['start_date'] = props.alumniService.start_date ? new Date(props.alumniService.start_date) : null;
    initialValues['end_date'] = props.alumniService.end_date ? new Date(props.alumniService.end_date) : null;
    initialValues['fee_submission_date'] = props.alumniService.fee_submission_date ? new Date(props.alumniService.fee_submission_date) : null;
  }

  const onSubmit = async (values) => {
    onHide(values);
  };

  useEffect(() => {
    // getAllBatches().then(data => {
    //   setBatchOptions(data?.data?.data?.batches.map((batches) => ({
    //     key: batches.name,
    //     label: batches.name,
    //     value: batches.id,
    //   })));
    // });

    getProgramEnrollmentsPickList().then(data => {
    //   setStatusOptions(data.status.map(item => ({ key: item.value, value: item.value, label: item.value })));
    //   setFeeStatusOptions(data.fee_status.map(item => ({ key: item.value, value: item.value, label: item.value })));
    //   setYearOfCompletionOptions(data.year_of_completion.map(item => ({ key: item.value, value: item.value, label: item.value })));
    //   setCurrentCourseYearOptions(data.current_course_year.map(item => ({ key: item.value, value: item.value, label: item.value })));
    //   setCourseLevelOptions(data.course_level.map(item => ({ key: item.value, value: item.value, label: item.value })));
    //   setCourseTypeOptions(data.course_type.map(item => ({ key: item.value, value: item.value, label: item.value })));
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
                      name="alumni_service_student"
                      control="input"
                      label="Assigned To"
                      className="form-control"
                      placeholder="Assigned To"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="type"
                      control="input"
                      label="Type"
                      className="form-control"
                      placeholder="Type"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mt-2">
                    <Input
                      name="location"
                      control="input"
                      label="Location"
                      className="form-control"
                      placeholder="Location"
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
                      required
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
                      required
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
                      required
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
                      required
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
