import { useState, useEffect } from "react";
import moment from 'moment';
import { Badge } from "../../../components/content/Utils";
import DetailField from "../../../components/content/DetailField";
import { getStudentsPickList } from "./StudentActions";
import { urlPath } from "../../../constants";
import styled from "styled-components";
import {studentStatusOptions} from "./StudentConfig";
import ProgressBar from "../../../components/content/ProgressBar";
import { FaTrashAlt, FaEye, FaCheckCircle } from "react-icons/fa";
import CvUpload from "../../../components/content/Cv";
import { UPDATE_STUDENT } from "../../../graphql";
import Tooltip from "../../../components/content/Tooltip";

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
  .icon-box {
    margin: -15px 20px 0px 0px;
   }
}

@media screen and (min-width: 768px) {
  .icon-box {
  margin: -15px 20px 0px 210px;
  }
}

.icon-box{
  display:flex;
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

  let activestep = 0;
  switch(status){
    case "Certified":
      activestep = 1
      break;
    case "Internship Complete":
      activestep=2
      break;
    case "Placement Complete":
      activestep =3 
      break;
  }

  return (
    <Styled>
      <div className="container-fluid my-3">
        <ProgressBar steps={['Registered', 'Certified','Internship Complete','Placement Complete']} activeStep={activestep} />
        <div className="row latto-regular">
          <div className="col-md-4">
            <DetailField label="Name" value={full_name} />
            <DetailField label="Parents Name" value={name_of_parent_or_guardian} />
            <DetailField label="Phone number" value={<a href="tel:+91">{phone}</a>} />
            <DetailField label="Email" value={<a target="_blank" href={`mailto:${email}`} rel="noreferrer">{email}</a>} />
            <DetailField label="Date of Birth" value={moment(date_of_birth).format("DD MMM YYYY")} />
            &nbsp;
            <DetailField label="Created at" value={moment(created_at).format("DD MMM YYYY, h:mm a")} />
            
          </div>
          <div className="col-md-4">
            <DetailField label="Assigned To" value={assigned_to?.username} />
            <DetailField label=" Student ID" value={student_id} />
            <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
            <DetailField label="Gender" value={<Badge value={gender} pickList={pickList.gender || []} />} />
            <DetailField label="Category" value={<Badge value={category} pickList={pickList.category || []} />} />
            &nbsp;
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
          <div className="col-md-4">
          <DetailField label="Income Level (INR)" value={income_level} />
          <DetailField label="CV Upload" value=
              {CV &&
                <div>
                  <label>CV</label>
                  <p>(updated on: {moment(CV.updated_at).format("DD MMM YYYY")})</p>
                </div> 
                }
                />
             <div className="icon-box">
              <div class=" col-md-1">
                <CvUpload query={UPDATE_STUDENT} id={id} done={() => onUpdate()} />
              </div>
              <div class="col-md-1">
                {CV &&
                  <div className="col-md-1 d-flex flex-column section-cv">   
                    <Tooltip placement="top" title="Click Here to View CV">
                      <a href={urlPath(CV?.url)} target="_blank" ><FaEye size="25" color={CV ? '#207B69' : '#787B96'}/></a>
                     </Tooltip>   
                  </div>   
                }
              </div>
              <div class="col-md-1">
                {CV &&
                  <Tooltip placement="top" title="Click Here to Delete CV">
                    <a  href="#" class="menu_links" onClick={() => onDelete()}> <FaTrashAlt  size="25" color={CV ? '#207B69' : '#787B96'} /> </a>
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
