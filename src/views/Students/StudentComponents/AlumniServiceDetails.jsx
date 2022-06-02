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
