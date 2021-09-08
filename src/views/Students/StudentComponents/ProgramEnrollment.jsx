import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import { getProgramEnrollmentsPickList } from "../../Institutions/InstitutionComponents/instituteActions";
import DetailField from '../../../components/content/DetailField';
import { Badge } from "../../../components/content/Utils";
import { FaDownload } from "react-icons/fa";
import { urlPath } from "../../../constants";

const ProgramEnrollment = (props) => {
  let { onHide, show, handleEdit, handleDelete, student, programEnrollment } = props;
  const [pickList, setPickList] = useState([]);

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
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Name" value={`${student.first_name} ${student.last_name}`} />
              <DetailField label="Batch" value={programEnrollment.batch?.name} />
              <DetailField label="Institution" value={programEnrollment.institution?.name} />
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField label="Status" value={<Badge value={programEnrollment.status} pickList={pickList.status} />} />
              <DetailField label="Registration Date" value={programEnrollment.registration_date ? moment(programEnrollment.registration_date).format("DD MMM YYYY") : ''} />
            </div>
          </div>
          <hr className="mb-4 opacity-1" style={{color: '#C4C4C4'}} />
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
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Fee Status" value={<Badge value={programEnrollment.fee_status} pickList={pickList.fee_status} />} />
              <DetailField label="Discount Code ID" value={``} />
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
              <DetailField label="Certificate" value={programEnrollment.medha_program_certificate ? <div><a href={urlPath(programEnrollment.medha_program_certificate.url)} target="_blank" className="c-pointer mb-1 d-block"><FaDownload size="20" color="#6C6D78" /></a><div style={{fontSize: '12px', fontFamily: 'Latto-Italic', color: '#787B96'}}>(updated on: {moment(programEnrollment.medha_program_certificate.created_at).format("DD MMM YYYY")})</div></div> : ''} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12 d-flex justify-content-center">
              <button type="button" className="btn btn-primary px-4 mx-4" onClick={handleEdit}>EDIT</button>
              <button type="button" className="btn btn-danger px-4 mx-4" onClick={handleDelete}>DELETE</button>
              <button type="button" className="btn btn-primary px-4 mx-4" onClick={() => {}}>REGENERATE CERTIFICATE</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
  );
};

export default ProgramEnrollment;
