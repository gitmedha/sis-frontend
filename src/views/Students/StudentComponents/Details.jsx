import { useState, useEffect } from "react";
import { Badge } from "../../../components/content/Utils";
import DetailField from "../../../components/content/DetailField";
import { getStudentsPickList } from "./StudentActions";
import { urlPath } from "../../../constants";
import styled from "styled-components";
import {studentStatusOptions} from "./StudentConfig";

const Styled = styled.div`
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
`;

const Details = (props) => {
  const {
    first_name,
    last_name,
    phone,
    name_of_parent_or_guardian,
    category,
    email,
    status,
    gender,
    date_of_birth,
    income_level,
    logo,
    old_sis_id,
    course_type_latest
  } = props;

  const [pickList, setPickList] = useState([]);
  const studentStatusData = studentStatusOptions.find(option => option.picklistMatch.toLowerCase() === status?.toLowerCase());

  useEffect(() => {
    getStudentsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  return (
    <Styled>
      <div className="container my-3">
        <hr className="separator" />
        <div className="row latto-regular">
          <div className="col-md-4">
            <DetailField label="First Name" value={first_name} />
            <DetailField label="Last Name" value={last_name} />
            <DetailField label="Parents Name" value={name_of_parent_or_guardian} />
            <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
            <DetailField label="Gender" value={<Badge value={gender} pickList={pickList.gender || []} />} />
          </div>
          <div className="col-md-4">
            <DetailField label="Phone number" value={phone} />
            <DetailField label="Email" value={<a target="_blank" href={`mailto:${email}`} rel="noreferrer">{email}</a>} />
            <DetailField label="Date of Birth" value={date_of_birth} />
            <DetailField label="Category" value={<Badge value={category} pickList={pickList.category || []} />} />
            <DetailField label="Income Level (INR)" value={income_level} />
          </div>
          <div className="col-md-4 d-flex justify-content-end">
            <div className="img-profile-container">
              <div className="status-icon">{studentStatusData?.icon}</div>
              <img className="img-profile" src={urlPath(logo?.url)} alt={`${first_name} ${last_name}`} />
            </div>
          </div>
        </div>
        <hr className="separator" />
        <div className="row">
          <div className="col-md-6">
            <DetailField label="Medha Champion" value={''} />
            <DetailField label="Interested in Employment Opportunities" value={''} />
            <DetailField label="ID in SIS 2.0" value={old_sis_id} />
            <DetailField label="Latest Course Type" value={course_type_latest} />
          </div>
          <div className="col-md-6">
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Details;
