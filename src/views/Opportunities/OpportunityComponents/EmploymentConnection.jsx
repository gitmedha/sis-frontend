import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from '../../../components/content/DetailField';
import { Anchor, Badge } from "../../../components/content/Utils";
import { getEmploymentConnectionsPickList, getOpportunitiesPickList } from "../../Students/StudentComponents/StudentActions";

const EmploymentConnection = (props) => {
  let { onHide, show, handleEdit, handleDelete, student, employmentConnection } = props;
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
      <Modal.Body className="bg-white">
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <DetailField label="Student" value={<Anchor text={student.full_name} href={`/student/${student.id}`}  />} />
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
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-12 d-flex justify-content-center">
            <button type="button" className="btn btn-primary px-4 mx-4" onClick={handleEdit}>EDIT</button>
            <button type="button" className="btn btn-danger px-4 mx-4" onClick={handleDelete}>DELETE</button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EmploymentConnection;
