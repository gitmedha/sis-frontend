import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from '../../../components/content/DetailField';
import { Anchor, Badge } from "../../../components/content/Utils";
import CertificateUpload from "../../../components/content/Certificate";
import { urlPath } from "../../../constants";
import Tooltip from "../../../components/content/Tooltip";
import { FaTrashAlt, FaEye, FaCheckCircle } from "react-icons/fa";
import { getEmploymentConnectionsPickList, getOpportunitiesPickList } from "../../Students/StudentComponents/StudentActions";
import { UPDATE_EMPLOYMENT_CONNECTION } from "../../../graphql";
import styled from "styled-components";

const Styled = styled.div`
.icon-box{
  display:flex;
  padding: 5px;
  justify-content: center;
}
`;

const EmploymentConnection = (props) => {
  let {onDelete, onUpdate, onHide, show, handleEdit, handleDelete, student, employmentConnection } = props;
  const [employmentConnectionsPickList, setEmploymentConnectionsPickList] = useState([]);
  const [opportunitiesPickList, setOpportunitiesPickList] = useState([]);

  useEffect(() => {
    getEmploymentConnectionsPickList().then(data => {
      setEmploymentConnectionsPickList(data);
    });
    getOpportunitiesPickList().then(data => {
      setOpportunitiesPickList(data);
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
            Employment Connection Details
          </h1>
        </Modal.Title>
      </Modal.Header>
      <Styled>
      <Modal.Body className="bg-white">
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <DetailField label="Student" value={<Anchor text={student?.full_name} href={`/student/${student?.id}`}  />} />
            <DetailField label="Employer" value={<Anchor text={employmentConnection.opportunity && employmentConnection.opportunity.employer ? employmentConnection.opportunity.employer.name : ''} href={`/employer/${ employmentConnection?.opportunity?.employer?.id }`}  />} />
            <DetailField label="Opportunity" value={employmentConnection.opportunity ? employmentConnection.opportunity.role_or_designation : ''} />
            <DetailField label="Opportunity Type" value={employmentConnection.opportunity ? <Badge value={employmentConnection.opportunity.type} pickList={opportunitiesPickList.type} /> : ''} />
            <DetailField label="Status" value={<Badge value={employmentConnection.status} pickList={employmentConnectionsPickList.status} />} />
          </div>
          <div className="col-md-6 col-sm-12">
            <DetailField label="Start Date" value={employmentConnection.start_date ? moment(employmentConnection.start_date).format("DD MMM YYYY") : ''} />
            <DetailField label="End Date" value={employmentConnection.end_date ? moment(employmentConnection.end_date).format("DD MMM YYYY") : ''} />
            <DetailField label="Rejection reason" value={employmentConnection.reason_if_rejected} />
            <DetailField label="Salary offered" value={employmentConnection.salary_offered} />
            <DetailField label="Source" value={<Badge value={employmentConnection.source} pickList={employmentConnectionsPickList.source} />} />
            <DetailField label="Upload Certificate" value= {
              employmentConnection.internship_certificate &&
            <div>
                <label>Certificate</label>
                  <p>(updated on: {moment(employmentConnection.internship_certificate.updated_at).format("DD MMM YYYY")})</p>
                </div> 
             } />
             <div className ="row">
              <div className="icon-box">
                <div class=" col-md-1">
                  <CertificateUpload query={UPDATE_EMPLOYMENT_CONNECTION} id={employmentConnection.id} done={() => onUpdate() } />
                </div>
                <div class="col-md-1">
                  { employmentConnection.internship_certificate &&
                    <div className="col-md-1 d-flex flex-column section-cv">   
                      <Tooltip placement="top" title="Click Here to View Certificate">
                        <a href={urlPath( employmentConnection.internship_certificate?.url)} target="_blank" ><FaEye size="25" color={employmentConnection.internship_certificate ? '#207B69' : '#787B96'} /></a>
                      </Tooltip>   
                    </div>   
                  }
                </div>
                <div class="col-md-1">
                  { employmentConnection.internship_certificate &&
                  <Tooltip placement="top" title="Click Here to Delete Certificate">
                    <a  href="#" class="menu_links" onClick={() => onDelete()}> <FaTrashAlt  size="25" color={employmentConnection.internship_certificate ? '#207B69' : '#787B96'} /> </a>
                  </Tooltip>   
                  }
                </div>
              </div> 
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-12 d-flex justify-content-center">
            <button type="button" className="btn btn-primary px-4 mx-4" onClick={handleEdit}>EDIT</button>
            <button type="button" className="btn btn-danger px-4 mx-4" onClick={handleDelete}>DELETE</button>
          </div>
        </div>
      </Modal.Body>
      </Styled>
    </Modal>
  );
};

export default EmploymentConnection;
