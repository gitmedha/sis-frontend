import { useState, useEffect } from "react";
import { Badge } from "../../../components/content/Utils";
import DetailField from "../../../components/content/DetailField";
import { FaCheckCircle } from "react-icons/fa";
import  {getOpportunitiesPickList} from "./opportunityAction"
import Employer from "../../Employers/Employer";

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
    employer
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
          <DetailField label="Employer" value={employer ? employer.name : ''} />
          <DetailField label="Location" value={employer ? employer.address : ''} />
          <DetailField label="No. of openings" value={number_of_opportunities} />
          <DetailField label="Paid" value={<FaCheckCircle size="20" color={compensation_type == 'yes' ? '#207B69' : '#E0E0E8'} />} />
          <DetailField label="Monthly Salary" value={salary} />
          <DetailField label="Role Description" value={role_description} />
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="Type" value={<Badge value={type} pickList={pickList.type} />} />
          <DetailField label="Assigned To" value={assigned_to ? assigned_to.username : ''} />
          <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
          <DetailField label="Department/Team" value={department_or_team} />
          <DetailField label="Skills Required" value={skills_required} />
        </div>
      </div>
    </div>
  );
};

export default Details;
