import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from '../../../components/content/DetailField';
import styled from "styled-components";

const FileStyled = styled.div`
  .icon-box{
    display:flex;
    padding: 5px;
    justify-content: center;
  }
  .cv-icon {
    margin-right: 20px;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 50%;

    &:hover {
      background-color: #EEE;
      box-shadow: 0 0 0 1px #C4C4C4;
    }
  }
`;

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

const MembershipView = (props) => {
  let { onHide, show, handleEdit, handleDelete, student } = props;
  const [membership, setMembership] = useState(props.membership);

  useEffect(() => {
    setMembership(props.membership);
  }, [props]);

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
            Membership Details
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Section>
          <FileStyled>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <DetailField label="Student" className="capitalize" value={student.full_name} />
                <DetailField label="Medhavi Member" value={membership.medhavi_member ? "Yes" : "No"} />
                <DetailField label="Member ID" value={membership.medhavi_member_id} />
                <DetailField label="Membership Fee" value={membership.membership_fee ? `₹${membership.membership_fee}` : ''} />
                <DetailField label="Date of Payment" value={membership.date_of_payment ? moment(membership.date_of_payment).format("DD MMM YYYY") : ''} />
                <DetailField label="Date of Avail" value={membership.date_of_avail ? moment(membership.date_of_avail).format("DD MMM YYYY") : ''} />
              </div>
              <div className="col-md-6 col-sm-12">
                <DetailField label="Assigned To" value={membership.assigned_to?.username} />
                <DetailField label="Receipt Number" value={membership.receipt_number} />
                <DetailField label="Date of Settlement" value={membership.date_of_settlement ? moment(membership.date_of_settlement).format("DD MMM YYYY") : ''} />
                <DetailField label="Tenure Completion Date" value={membership.tenure_completion_date ? moment(membership.tenure_completion_date).format("DD MMM YYYY") : ''} />
                <DetailField label="Membership Status" value={membership.membership_status} />
                {membership.membership_status === "Cancelled" && (
                  <DetailField label="Reason for Cancellation" value={membership.reason_for_cancellation} />
                )}
              </div>
            </div>
          </FileStyled>
          <div className="row mt-4">
            <div className="col-md-12 d-flex justify-content-center">
              <button type="button" className="btn-box btn btn-primary" onClick={handleEdit}>EDIT</button>
              <button type="button" className="btn-box btn btn-danger" onClick={handleDelete}>DELETE</button>
            </div>
          </div>
        </Section>
      </Modal.Body>
    </Modal>
  );
};

export default MembershipView;