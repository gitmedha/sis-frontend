import { useState, useEffect } from "react";
import moment from 'moment';
import { Badge } from "../../../components/content/Utils";
import DetailField from "../../../components/content/DetailField";
import { getStudentsPickList } from "./StudentActions";
import { urlPath } from "../../../constants";
import styled from "styled-components";
import {studentStatusOptions} from "./StudentConfig";
import { FaTrashAlt, FaEye, FaCheckCircle } from "react-icons/fa";
import CvUpload from "../../../components/content/Cv";
import { UPDATE_STUDENT } from "../../../graphql";
import Tooltip from "../../../components/content/Tooltip";

const Styled = styled.div`
 p, label {
    color: #787B96;
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
    label {
      font-size: 14px;
      line-height: 1.25;
    }
    p {
      font-size: 12px;
      line-height: 1.25;
      margin-bottom: 0;
      margin-left: 15px;
      font-family: 'Latto-Italic';
    }
  }
`;

const Details = (props) => {
  let { onUpdate, onDelete } = props;
  const {
    id,
    student_id,
    full_name,
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
    course_type_latest,
    medha_champion,
    interested_in_employment_opportunities,
    CV,
    assigned_to,
    created_at,
    updated_at,
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
      <div className="container-fluid my-3">
        <div className="row latto-regular">
          <div className="col-md-4">
            <DetailField label=" Name" value={full_name} />
            <DetailField label="Parents Name" value={name_of_parent_or_guardian} />
            <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
            <DetailField label="Gender" value={<Badge value={gender} pickList={pickList.gender || []} />} />
            <DetailField label="Created at" value={moment(created_at).format("DD MMM YYYY, h:mm a")} />
            <DetailField label="Assigned To" value={assigned_to?.username} />
          </div>
          <div className="col-md-4">
          <DetailField label=" Student ID" value={student_id} />
            <DetailField label="Phone number" value={<a href="tel:+91">{phone}</a>} />
            <DetailField label="Email" value={<a target="_blank" href={`mailto:${email}`} rel="noreferrer">{email}</a>} />
            <DetailField label="Date of Birth" value={moment(date_of_birth).format("DD MMM YYYY")} />
            <DetailField label="Category" value={<Badge value={category} pickList={pickList.category || []} />} />
            <DetailField label="Income Level (INR)" value={income_level} />
            <DetailField label="Updated at" value={moment(updated_at).format("DD MMM YYYY, h:mm a")} />
          </div>
          
          <div className="col-md-4 d-flex justify-content-end">
            <div className="img-profile-container">
              <div className="status-icon">{studentStatusData?.icon}</div>
              {logo && <img className="img-profile" src={urlPath(logo.url)} alt={full_name} />}
            </div>
          </div>
        </div>
        <hr className="separator" />
        <div className="row">
          <div className="col-md-4">
            <DetailField label="Medha Champion" value={<FaCheckCircle size="20" color={medha_champion ? '#207B69' : '#E0E0E8'} />} />
            <DetailField label="Interested in Employment Opportunities" value={<FaCheckCircle size="20" color={interested_in_employment_opportunities ? '#207B69' : '#E0E0E8'} />} />
            {/* <DetailField label="ID in SIS 2.0" value={old_sis_id} /> */}
            {/* <DetailField label="Latest Course Type" value={course_type_latest} /> */}
          </div>
          <div className="col-md-2" style={{marginTop : '35px'}}>
            <DetailField label="CV Upload "/>
          </div>
          <div  className ="col-md-4" style={{marginTop : '-15px'}} >
            <div class="row justify-content-start">
              {CV &&
                <div className="d-flex align-items-start mb-2">
                  <label>CV</label>
                  <p>(updated on: {moment(CV.updated_at).format("DD MMM YYYY")})</p>
                </div> 
              }
                <div class="col-2" >
                  {CV &&
                    <div className="col-md-12 d-flex flex-column section-cv">   
                      <Tooltip placement="top" title="Click Here to View CV">
                        <a href={urlPath(CV?.url)} target="_blank" ><FaEye size="25" color={CV ? '#207B69' : '#787B96'}/></a>
                      </Tooltip>   
                    </div>          
                  }
                </div>   
              <div class="col-2">
                <CvUpload
                  query={UPDATE_STUDENT}
                  id={id}
                  done={() => onUpdate()}
                />
              </div>
             <div class="col-2">
              {CV &&
                <Tooltip placement="top" title="Click Here to Delete CV">
                 <a  href="#" class="menu_links" onClick={() => onDelete()}> <FaTrashAlt  size="25" color={CV ? '#ed1919' : '#787B96'} /> </a>
                </Tooltip>   
              }
             </div>
          </div>
        </div>
       </div>
      </div>
    </Styled>
  );
};

export default Details;
