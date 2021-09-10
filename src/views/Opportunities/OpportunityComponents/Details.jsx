import { useState, useEffect } from "react";
import { Badge } from "../../../components/content/Utils";
import DetailField from "../../../components/content/DetailField";
import { FaCheckCircle } from "react-icons/fa";

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
    name,
  } = props;

  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-6 col-md-4">
          <DetailField label="Role/Designation" value={role_or_designation} />
          <DetailField label="Employer" value={"name"} />
          <DetailField label="Location" value={""} />
          <DetailField label="No. of Opening & Type" value={number_of_opportunities} />          
          <DetailField label="Paid" value={<FaCheckCircle size="20" color={compensation_type ? '#207B69' : '#E0E0E8'} />} />
          <DetailField label="Monthly Salary" value={salary} />
          <DetailField label="Role Description" value={role_description} />   
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="Assigned To" value={""} />
          <DetailField label="Status" value={<Badge value={status} />} />
          <DetailField label="Department/Function" value={department_or_team} />
          <DetailField label="Skills Required" value={skills_required} />
        </div>
      </div>
    </div>
  );
};

export default Details;
