import moment from 'moment';
import DetailField from "../../../components/content/DetailField";
import styled from "styled-components";

const Styled = styled.div`
  p, label {
      color: #787B96;
  }

  @media screen and (min-width: 425px) {
    .col-md-1 {
      flex: 0 0 auto;
      width: 8.33333%;
      padding: 0px 33px 0px 4px;
    }
  }

  @media screen and (max-width: 360px) {
    .col-md-1{
      padding: 0px 15px 0px 0px;
    }
  }

  .container-fluid {
    padding-left: 30px;
    padding-right: 30px;
  }

  .img-profile-container {
    position: relative;
    .status-icon {
      position: absolute;
      top: 0;
      right: 0;
      padding: 1px 5px 5px 5px;
    }
    .img-profile {
      width: 160px;
      margin-left: auto;
    }
  }
  .separator {
    background-color: #C4C4C4;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  hr {
    height: 1px;
  }
  .section-cv {
    color: #787B96;
    label, {
      font-size: 14px;
      line-height: 1.25;
    }
    p {
      font-size: 12px;
      line-height: 1.25;
      margin-bottom: 0;
      margin-left: 15px;
      font-family: 'Latto-Italic';
      color: #787B96;
    }
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

const AlumniServiceDetails = (props) => {
  const {
    alumni_service_type,
    alumni_service_assigned_to,
    alumni_service_start_date,
    alumni_service_end_date,
    alumni_service_fee_submission_date,
    alumni_service_fee_amount,
    alumni_service_location,
    alumni_service_receipt_number,
    alumni_service_comments,
  } = props;

  return (
    <Styled>
      <div className="container-fluid my-3">
        <div className="row latto-regular">
          <div className="col-md-5">
            <DetailField label="Alumni Service Type" value={alumni_service_type} />
            <DetailField label="Start Date" value={moment(alumni_service_start_date).format("DD MMM YYYY")} />
            <DetailField label="Fee Submission Date" value={moment(alumni_service_fee_submission_date).format("DD MMM YYYY")} />
            <DetailField label="Location" value={alumni_service_location} />
            <DetailField label="Comments" value={alumni_service_comments} />
            &nbsp;
          </div>
          <div className="col-md-4">
            <DetailField label="Assigned To" value={alumni_service_assigned_to?.username} />
            <DetailField label="End Date" value={moment(alumni_service_end_date).format("DD MMM YYYY")} />
            <DetailField label="Fee Amount (INR)" value={alumni_service_fee_amount} />
            <DetailField label="Receipt Number" value={alumni_service_receipt_number} />
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default AlumniServiceDetails;
