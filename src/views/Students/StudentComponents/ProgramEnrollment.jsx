import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import DetailField from '../../../components/content/DetailField';
import { Anchor, Badge } from "../../../components/content/Utils";
import { FaDownload } from "react-icons/fa";
import styled from "styled-components";
import { generateCertificate } from "../../../utils/function/certificate";

const Section = styled.div`
  padding-top: 11px;
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
    margin-bottom: 20px;
    margin-top: px;
  }

  .btn-box{
    padding-right: 1.5rem!important;
    padding-left: 1.5rem!important;
    margin-right: 1.5rem!important;
    margin-left: 1.5rem!important;
  }

  @media screen and (max-width: 360px) {
    .btn-box{
      height: 57px;
      width: 117px;
      padding-right: 0.5rem!important;
      padding-left: 0.5rem!important;
      margin-right: 0.5rem!important;
      margin-left: 0.5rem!important;
    }
  }
`;

const ProgramEnrollment = (props) => {
  let { onHide, show, handleEdit, handleDelete, student } = props;
  const [pickList, setPickList] = useState([]);
  const [loadingCertificationButton, setLoadingCertificationButton] = useState(false);
  const [programEnrollment, setProgramEnrollment] = useState(props.programEnrollment);
  const [programEnrollmentCertificate, setProgramEnrollmentCertificate] = useState(null);


  const handleGenerateCertificate = async () => {
    setLoadingCertificationButton(true);
    let response = await generateCertificate(programEnrollment.id);
    if (response.programEnrollment) {
      setProgramEnrollment(response.programEnrollment);
    }
    setLoadingCertificationButton(false);
  }

  useEffect(() => {
    setProgramEnrollment(props.programEnrollment);

    if (props.programEnrollment) {
      let certificateFieldValue = '';
      if (props.programEnrollment.medha_program_certificate) {
        certificateFieldValue = <div><a href={props.programEnrollment.medha_program_certificate.url} target="_blank" className="c-pointer mb-1 d-block"><FaDownload size="20" color="#6C6D78" /></a><div style={{fontSize: '12px', fontFamily: 'Latto-Italic', color: '#787B96'}}>(updated on: {moment(props.programEnrollment.medha_program_certificate.created_at).format("DD MMM YYYY")})</div></div>;
      } else if (props.programEnrollment.medha_program_certificate_status == 'processing') {
        certificateFieldValue = 'Processing';
      }
      setProgramEnrollmentCertificate(certificateFieldValue);
    }
  }, [props]);

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setPickList(data);
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
              Program Enrollment Details
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white">
        <Section>
          <h2 className="section-header">Enrollment Details</h2>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Name" value={student.full_name} />
              <DetailField label="Batch" value={<Anchor text={programEnrollment.batch?.name} href={`/batch/${programEnrollment.batch?.id}`} />} />
              <DetailField label="Institution" value={<Anchor text={programEnrollment.institution?.name} href={`/institution/${programEnrollment.institution?.id}`} />} />
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField label="Program Status" value={<Badge value={programEnrollment.status} pickList={pickList.status} />} />
              <DetailField label="Registration Date" value={programEnrollment.registration_date ? moment(programEnrollment.registration_date).format("DD MMM YYYY") : ''} />
              <DetailField label="Program Name" value={programEnrollment.program_selected_by_student} />
            </div>
          </div>
          <hr className="mb-4 opacity-1" style={{color: '#C4C4C4'}} />
          <h2 className="section-header">Course Details</h2>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Course Level" value={<Badge value={programEnrollment.course_level} pickList={pickList.course_level} />} />
              <DetailField label="Course Type" value={<Badge value={programEnrollment.course_type} pickList={pickList.course_type} />} />
              <DetailField label="Current Course Year" value={<Badge value={programEnrollment.course_year} pickList={pickList.current_course_year} />} />
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField label="Year of Completion" value={<Badge value={programEnrollment.year_of_course_completion} pickList={pickList.year_of_completion} />} />
              <DetailField label="Program Enrollment ID" value={`To Be Decided`} />
              <DetailField label="Course Name" value={programEnrollment.course_name_in_current_sis} />
            </div>
          </div>
          <hr className="mb-4 opacity-1" style={{color: '#C4C4C4'}} />
          <h2 className="section-header">Fee Details</h2>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Fee Status" value={<Badge value={programEnrollment.fee_status} pickList={pickList.fee_status} />} />
              <DetailField label="Discount Code ID" value={programEnrollment.discount_code_id} />
              <DetailField label="Fee Amount (INR)" value={programEnrollment.fee_amount} />
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField label="Fee Payment Date" value={programEnrollment.fee_payment_date ? moment(programEnrollment.fee_payment_date).format("DD MMM YYYY") : ''} />
              <DetailField label="Transaction ID / Receipt No." value={programEnrollment.fee_transaction_id} />
              <DetailField label="Fee Refund Date" value={programEnrollment.fee_refund_date ? moment(programEnrollment.fee_refund_date).format("DD MMM YYYY") : ''} />
            </div>
          </div>
          <hr className="mb-4 opacity-1" style={{color: '#C4C4C4'}} />
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Certification Date" value={programEnrollment.certification_date ? moment(programEnrollment.certification_date).format("DD MMM YYYY") : ''} />
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField label="Certificate" value={programEnrollmentCertificate} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12 d-flex justify-content-center">
              <button type="button" className="btn-box btn btn-primary" onClick={handleEdit}>EDIT</button>
              <button type="button" className="btn-box btn btn-danger" onClick={handleDelete}>DELETE</button>
              <button type="button" className="btn-box btn btn-primary" onClick={handleGenerateCertificate} disabled={loadingCertificationButton}>REGENERATE CERTIFICATE</button>
            </div>
          </div>
          </Section>
        </Modal.Body>
      </Modal>
  );
};

export default ProgramEnrollment;
