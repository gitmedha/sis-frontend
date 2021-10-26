import { useState, useEffect } from "react";
import { Anchor, Badge } from "../../../components/content/Utils";
import DetailField from "../../../components/content/DetailField";
import { FaCheckCircle } from "react-icons/fa";
import  {getOpportunitiesPickList} from "./opportunityAction"
import Employer from "../../Employers/Employer";
import moment from "moment";

const Details = (props) => {
  const {
    role_or_designation,
    number_of_opportunities,
    status,
    department_or_team,
    role_description,
    skills_required,
    compensation_type,
    salary,
    type,
    assigned_to,
    employer,
    created_at,
    updated_at
  } = props;

  const [pickList, setPickList] = useState([]);

  useEffect(() => {
    getOpportunitiesPickList().then(data => {
      setPickList(data);
    });
  }, [])

  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-6 col-md-4">
          <DetailField label="Role/Designation" value={role_or_designation} />
          <DetailField label="Employer" value={<Anchor text={employer ? employer.name : ''} href={`/employer/${employer?.id}`}  />} />
          {/* <DetailField label="Location" value={employer ? employer.address : ''} /> */}
          <DetailField label="No. of openings" value={number_of_opportunities} />
          <DetailField label="Paid" value={<FaCheckCircle size="20" color={compensation_type == 'yes' ? '#207B69' : '#E0E0E8'} />} />
          <DetailField label="Monthly Salary" value={salary} />
          <DetailField label="Role Description" value={role_description} />
          <DetailField label="Created at" value={moment(created_at).format("DD MMM YYYY, h:mm a")} />
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="Type" value={<Badge value={type} pickList={pickList.type} />} />
          <DetailField label="Assigned To" value={assigned_to ? assigned_to.username : ''} />
          <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
          <DetailField label="Department/Team" value={<Badge value={department_or_team} pickList={pickList.department} />} />
          <DetailField label="Skills Required" value={skills_required} />
          <DetailField label="Updated at" value={moment(updated_at).format("DD MMM YYYY, h:mm a")} />
        </div>
      </div>
    </div>
  );
};

export default Details;
